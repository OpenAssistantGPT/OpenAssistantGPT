document.addEventListener("DOMContentLoaded", function () {
    (function () {
        // Ensure the chatbotConfig object exists and has a chatbotId property
        if (!window.chatbotConfig || !window.chatbotConfig.chatbotId) {
            console.error("Chatbot configuration is missing. Please set window.chatbotConfig.chatbotId.");
            return;
        }

        var chatbotId = window.chatbotConfig.chatbotId;

        // Create and append the button iframe
        var buttonIframe = document.createElement('iframe');
        buttonIframe.src = "https://www.openassistantgpt.io/embed/" + chatbotId + "/button?chatbox=false";
        buttonIframe.style = "z-index: 50; margin-right: 1rem; margin-bottom: 1rem; position: fixed; right: 0; bottom: 0; width: 56px; height: 56px; border: 0; border: 2px solid #e2e8f0; border-radius: 50%; color-scheme: none; background: none; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);";
        buttonIframe.id = "openassistantgpt-chatbot-button-iframe";
        document.body.appendChild(buttonIframe);

        // Create and append the chat iframe
        var chatIframe = document.createElement('iframe');
        chatIframe.src = "https://www.openassistantgpt.io/embed/" + chatbotId + "/window?chatbox=false&withExitX=true";
        chatIframe.style = "z-index: 50; margin-right: 1rem; margin-bottom: 6rem; display: none; position: fixed; right: 0; bottom: 0; pointer-events: none; overflow: hidden; height: 65vh; border: 2px solid #e2e8f0; border-radius: 0.375rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); width: 30rem;";
        chatIframe.allowFullscreen = true;
        chatIframe.id = "openassistantgpt-chatbot-iframe";
        document.body.appendChild(chatIframe);

        // Add the event listener script
        window.addEventListener("message", function (t) {

            var e = document.getElementById("openassistantgpt-chatbot-iframe");
            var s = document.getElementById("openassistantgpt-chatbot-button-iframe");

            if (t.data.type === 'checkScrollbar') {
                var hasScrollbar = t.data.hasScrollbar;
                if (hasScrollbar) {
                    s.style.width = "60px";
                    s.style.height = "60px";
                }
            }

            if ("openChat" === t.data) {
                console.log("Toggle chat visibility");
                if (e && s) {
                    e.contentWindow.postMessage("openChat", "*");
                    s.contentWindow.postMessage("openChat", "*");
                    e.style.pointerEvents = "auto";
                    e.style.display = "block";
                    if (window.innerWidth < 640) {
                        e.style.position = "fixed";
                        e.style.width = "100%";
                        e.style.height = "100%";
                        e.style.top = "0";
                        e.style.left = "0";
                        e.style.zIndex = "9999";
                    } else {
                        e.style.position = "fixed";
                        e.style.width = "30rem";
                        e.style.height = "65vh";
                        e.style.bottom = "0";
                        e.style.right = "0";
                        e.style.top = "";
                        e.style.left = "";
                    }
                } else {
                    console.error("iframe not found");
                }
            } else if ("closeChat" === t.data && e && s) {
                e.style.display = "none";
                e.style.pointerEvents = "none";
                e.contentWindow.postMessage("closeChat", "*");
                s.contentWindow.postMessage("closeChat", "*");
            }
        });
    })();
});
