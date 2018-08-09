module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.log(req);
    var message = {
        'text': req.body.text,
        'address': req.body.address
    }

    context.log('Message: \n{\n\t\'text\': \'' + message.text + '\',\n\t\'address\': \''+message.address+'\'\n}');
    context.done(null, message);
};