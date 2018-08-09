module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log(req);
    if (req.query.text != "undefined")
        var message = {
            'text': req.query.text,
            'address': req.query.address
        }
    else
        var message = {
            'text': 'test',
            'address': 'none'
        }

    context.log('Message: \n{\n\t\'text\': \'' + message.text + '\',\n\t\'address\': \''+message.address+'\'\n}');
    context.done(null, message);
};