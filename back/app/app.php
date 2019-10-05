<?php

/*
 * Local variables.
 *
 * @var \Phalcon\Mvc\Micro $app
 */

// REST API routes
$app->get('/', function () {
    echo $this['view']->render('index');
});

//search an item
$app->get('/search/{name}', function ($name) use ($app) {
    $result = $app['db']->query('SELECT * FROM product WHERE name like :n', [
        'n' => "%${name}%",
    ]);
    $news = $result->fetchAll();

    return $app->response->setJsonContent([
        'code' => 0,
        'data' => $news,
    ]);
});

//create new item
$app->post('/new', function () use ($app) {
    $data = $app->request->getJsonRawBody();
    $name = $data->name;

    $result = $app['db']->execute('INSERT IGNORE INTO product(name) VALUES(:name)', [
        ':name' => $data->name,
    ]);

    return $app->response->setJsonContent([
        'code' => 0,
    ]);
});

// Not found handler
$app->notFound(function () use ($app) {
    $app->response->setStatusCode(404, 'Not Found')->sendHeaders();
    echo $app['view']->render('404');
});
