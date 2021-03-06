import mimetypes
import simplejson
import logging
import cgi, os
import cgitb; cgitb.enable()
import re

from tiddlyweb.web.http import HTTP404

DEFAULT_MIME_TYPE = 'application/octet-stream'

def post_image(environ, start_response):

    user = environ['tiddlyweb.usersign']
    name = os.path.basename( user['name'] )

    if name == 'GUEST' or name == '':
        return respond( {'message':'Unauthorized','ok': False}, start_response )

    form = cgi.FieldStorage(fp=environ['wsgi.input'], environ=environ) 

    data = {}
    
    # A nested FieldStorage instance holds the file
    fileitem = form['file']

    # Test if the file was uploaded
    if fileitem.filename:

        (ftype, encoding) = mimetypes.guess_type( fileitem.filename, True );
        if re.match( "^image/", ftype ) == None:
            data['ok'] = False
            data['message'] = 'Illegal filetype'
            return respond({'ok':False,'message':'Illegal filetype'}, start_response)

        write_dir = 'images/%s' % name
        logging.debug( write_dir )

        if not os.path.isdir( write_dir ):
            os.mkdir( write_dir )

        # strip leading path from file name to avoid directory traversal attacks
        fn = os.path.basename(fileitem.filename)
        fp = '%s/%s' % ( write_dir, fn )
        logging.debug( fp )

        open(fp, 'wb').write(fileitem.file.read())

        data['message']= 'The file "' + fn + '" was uploaded successfully'
        data['image_path']  =  fp
        data['ok'] = True

    else:
        data['ok'] = False
        data['message'] = 'No file was uploaded'

    return respond( data, start_response )


def respond( data, start_response ):
    output = simplejson.dumps(data)
    start_response('200 OK', [
            ('Cache-Control', 'no-cache'),
            ('Content-Type', 'application/json')
            ])
    return [output]
    

def static(environ, start_response):
    pathname = "images"
    filename = environ['wsgiorg.routing_args'][1]['static_file']

    if '../' in filename:
        raise HTTP404('%s inavlid' % filename)

    full_path = os.path.join(pathname, filename)
    (mime_type, encoding) = mimetypes.guess_type(full_path)
    if not mime_type:
        mime_type = DEFAULT_MIME_TYPE

    if not os.path.exists(full_path):
        raise HTTP404('%s not found' % full_path)

    try:
        static_file = file(full_path)
    except IOError, exc:
        raise HTTP404('%s not found: %s' % (full_path, exc))

    start_response('200 OK', [
        ('Content-Type', mime_type)
        ])

    return static_file


def init(config):
    config['selector'].add('/images/{static_file:any}', GET=static)
    config['selector'].add( "/images", POST=post_image)
