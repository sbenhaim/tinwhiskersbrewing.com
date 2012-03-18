import logging
import simplejson
import tiddlyweb
import tiddlywebplugins.status

def init( config ):
    register_url( config['selector'], '/status', tw_status )

def tw_status(environ, start_response):
    data = tiddlywebplugins.status._gather_data(environ)
    roles = environ['tiddlyweb.usersign']['roles']

    data['role'] = roles[0] if len( roles ) > 0 else None

    output = simplejson.dumps(data)
    start_response('200 OK', [
            ('Cache-Control', 'no-cache'),
            ('Content-Type', 'application/json')
            ])
    return [output]

def register_url(selector, route, fun):
    replaced = False
    for index, (regex, handler) in enumerate(selector.mappings):
            if regex.match(route) is not None or selector.parser(route) == regex.pattern:
                handler['GET'] = fun
                selector.mappings[index] = (regex, handler)
                replaced = True
    if not replaced:
        selector.add(route, GET=fun)


