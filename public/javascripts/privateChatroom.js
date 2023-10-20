const socket = io.connect();
const currentUserId = localStorage.getItem("currentUserId");
const anotherUserId = window.location.pathname.split('/').pop();

function scrollToBottom() {
    let messageList = document.getElementById("messageList");
    messageList.scrollTop = messageList.scrollHeight;
}

function senderMsgObj(message) {
    const localTime = new Date(message.createdAt).toLocaleString()
    return "<div class='message-box'><div class='sender-info'><span class='sender-name self'>" + message.senderName + "(Me)" + "<span class='user-status'>" + message.senderStatus + "</span></span></div><div class='message-content'><p>" + message.content + "</p><span class='timestamp'>" + localTime + "</span></div></div>"
}

function receiverMsgObj(message) {
    const localTime = new Date(message.createdAt).toLocaleString()
    return "<div class='message-box'><div class='sender-info'><span class='sender-name'>" + message.senderName + "<span class='user-status'>" + message.senderStatus + "</span></span></div><div class='message-content'><p>" + message.content + "</p><span class='timestamp'>" + localTime + "</span></div></div>"
}


$(document).ready(function() {
    scrollToBottom();

    // Cancel alert first
    $.ajax({
        method: 'POST',
        url: '/messages/private/cancelAlert', 
        data: {
            senderId: anotherUserId,
            receiverId: currentUserId,
        }
    }).done(function() {
        console.log("alert cancelled")
    }).fail(function() {
        console.error('Failed to cancel alert:');
    });
    
    $("#sendMessageBtn").click(function() { 
        let messageContent = $("#messageInput").val();

        // Post new private message
        if(messageContent.trim() !== "") {
            $.ajax({
                method: 'POST',
                url: '/messages/private', 
                data: {
                    receiverId: anotherUserId,
                    content: messageContent,
                }
            }).done(function(response) {
                $("#messageInput").val(""); 
            }).fail(function(response) {
                console.error('Failed to send message:', response);
            });
        }
    });
});

socket.on('newPrivateMessage', function(message) {
    if ((currentUserId === message.senderId || currentUserId === message.receiverId) && (anotherUserId === message.receiverId || anotherUserId === message.senderId)) {
        if (currentUserId === message.senderId) {
            $("#messageList").append(senderMsgObj(message))
        } else {
            $("#messageList").append(receiverMsgObj(message))
        }

        if (currentUserId === message.receiverId) {
            $.ajax({
                method: 'POST',
                url: '/messages/private/cancelAlert', 
                data: {
                    senderId: anotherUserId,
                    receiverId: currentUserId,
                }
            }).done(function() {
                console.log("alert cancelled_2")
            }).fail(function() {
                console.error('Failed to cancel alert:');
            });
        }
        
        scrollToBottom();
    }
});
