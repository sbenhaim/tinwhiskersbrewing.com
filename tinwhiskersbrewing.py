import logging
import simplejson
import tiddlyweb
import tiddlywebplugins.diststore

import tiddlywebplugins.status
from tiddlyweb.web.validator import TIDDLER_VALIDATORS
from tiddlyweb.model.policy import UserRequiredError, ForbiddenError

def init( config ):
    register_url( config['selector'], '/status', tw_status )

def tw_status(environ, start_response):
    data = tiddlywebplugins.status._gather_data(environ)
    user = environ['tiddlyweb.usersign']
    roles = user['roles']

    data['role'] = roles[0] if len( roles ) > 0 else None


    store = environ['tiddlyweb.store']

    bag_names = []
    for bag in [store.get( bag ) for bag in store.list_bags()]:
        try:
            if bag.policy.allows(user, 'write'):
                bag_names.append(bag.name)
        except (UserRequiredError, ForbiddenError):
            pass
        
    data['bags'] = bag_names

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


