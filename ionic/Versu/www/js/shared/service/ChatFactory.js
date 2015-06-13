/**
 * Created by egacl on 11-06-15.
 */

angular.module('socket.services', [])

    .factory('socket2', function socket($rootScope) {

        var baseUrl = 'http://chat.socket.io';
        console.log('conexion socket2: ' + baseUrl);
        var socket = io.connect('http://chat.socket.io');
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    })

    .factory('socket',function(socketFactory, $rootScope){
        console.log('conexion socket2');

        var URL_SOCKET = 'http://54.207.124.107:443';
        //var URL_SOCKET = 'http://146.155.116.26:3001';

        var isConnected = false;
        //Create socket and connect to http://chat.socket.io
        var myIoSocket = io.connect(URL_SOCKET);

        myIoSocket.on('connect', function(){
            isConnected = true;
            myIoSocket.emit('connection', {});
        });

        mySocket = socketFactory({
            ioSocket: myIoSocket,
            on: function (eventName, callback) {
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(myIoSocket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(myIoSocket, args);
                        }
                    });
                })
            },
            isConnected : function() {
                return isConnected;
            }
        });

        return mySocket;
    })


    /*
    .factory('chatsocket',function(socketFactory, $rootScope){
        var connected = false;
        var topicsRooms = [];

        console.log('conexion socket3');

        var myIoSocket = io.connect('http://chat.socket.io');
        var socket = socketFactory({ioSocket : myIoSocket});
        console.log('conectado socket3');

        socket.on('connect',function(){
            console.log('conectado al socket');
            connected = true;
        });


        return {
            loginIntoTopic : function(username, topic) {
                topicsRooms[topic] = { connected : false, messageList : [], connectedUser : [] };
                console.log('se envia login al topico: ' + topic);
                //Se envia mensaje de login para el topico
                socket.emit('add user', username, topic);

                //Al recibir el resultado del login se
                socket.on('login', function (data) {
                    //Set the value of connected flag
                    topicsRooms[topic].connected = true;
                    topicsRooms[topic].number_message = data.numUsers;
                    $rootScope.$broadcast('chat:login', {topic : topicsRooms[topic], data : data});
                    $rootScope.$emit('chat:login', {topic : topicsRooms[topic], data : data});
                });

                //Al recibir un nuevo mensaje
                socket.on('new message', function (data) {
                    console.log('llega mensaje del topico ' + topic);
                    console.log(data);
                    console.log(topicsRooms[topic]);
                    if(data.message && data.username) {
                        topicsRooms[topic].messageList.push({username:data.username, message: data.message});
                        if(topicsRooms[topic].messageList.length>100) {
                            while (topicsRooms[topic].messageList.length > 50) {
                                topicsRooms[topic].messageList.splice(0, 1);
                            }
                        }
                        $rootScope.$broadcast('chat:newmessage', {username:data.username, message: data.message});
                        $rootScope.$emit('chat:newmessage', {username:data.username, message: data.message});
                    }
                });

                //Al recibir la conexion de un nuevo usuario
                socket.on('user joined', function (data) {
                    topicsRooms[topic].connectedUser.push(data.username);
                    $rootScope.$broadcast('chat:userjoin', {username:data.username, numUsers: data.numUsers});
                    $rootScope.$emit('chat:userjoin', {username:data.username, numUsers: data.numUsers});
                });

                //Al recibir una desconexion
                socket.on('user left', function (data) {
                    var pos = topicsRooms[topic].connectedUser.indexOf(data.username);
                    if(pos>-1) {
                        topicsRooms[topic].connectedUser.splice(pos,1);
                    }
                    $rootScope.$broadcast('chat:userleft', {username:data.username, numUsers: data.numUsers});
                    $rootScope.$emit('chat:userleft', {username:data.username, numUsers: data.numUsers});
                });
            }
        };

    })*/