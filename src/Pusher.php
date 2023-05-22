<?php

namespace MyApp;

use Exception;
use Ratchet\ConnectionInterface;
use Ratchet\Wamp\WampServerInterface;

class Pusher implements WampServerInterface
{
    /**
     * A lookup of all the topics clients have subscribed to
     */
    protected array $subscribedTopics = array();

    public function onSubscribe(ConnectionInterface $conn, $topic)
    {
        $this->subscribedTopics[$topic->getId()] = $topic;
        if (isset($this->messages[$topic->getId()])) {
            //print_r($this->messages);
            $json = '[' . $this->messages[$topic->getId()] . ']';

            //send the history only for the user who just connected/subcribed
            $conn->event($topic, $json);
        }
    }

    public function onUnSubscribe(ConnectionInterface $conn, $topic)
    {
    }

    public function onOpen(ConnectionInterface $conn)
    {
    }

    public function onClose(ConnectionInterface $conn)
    {
    }

    public function onCall(ConnectionInterface $conn, $id, $topic, array $params)
    {
        // In this application if clients send data it's because the user hacked around in console
        $conn->callError($id, $topic, 'You are not allowed to make calls')->close();
    }

    public function onPublish(ConnectionInterface $conn, $topic, $event, array $exclude, array $eligible)
    {
        if (!isset($this->messages[$topic->getId()])) {
            $this->messages[$topic->getId()] = json_encode($event);
        } else {
            $this->messages[$topic->getId()] .= ', ' . json_encode($event);
        }

        //trigger a message for everyone on the same topic
        $topic->broadcast($event);
    }

    public function onError(ConnectionInterface $conn, Exception $e)
    {
    }
}