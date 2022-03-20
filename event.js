chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.todo == "activate") {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        chrome.pageAction.show(tabs[0].id);
      }
    );
  }
  /*  if (message.message === "getInfo") {
    const url = "https://api.receptiviti.com/v1/ping";
    // If you prefer the promise approach:
    axios
      .get(url, {
        auth: {
          username: "b669d0af6ee3432db45ebe5634a8dca1",
          password: "PULYnWSbqhR9UM+/WdBWLfhMdT9uSHzokm2xE6iA0Lq5QC/kizTwbyBG",
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  } */
});

chrome.storage.onChanged.addListener(function (result, namespaces) {
  if (result.subtitleWarning) {
    if (result.subtitleWarning.newValue) {
      chrome.notifications.getAll((items) => {
        if (items) for (let key in items) chrome.notifications.clear(key);
      });
      var notifOption = {
        iconUrl: "http://www.google.com/favicon.ico",
        type: "basic",
        iconUrl: "round-table.png",
        title: "Caption Off!",
        message: "Please turn on CAPTIONS!!",
      };
      chrome.notifications.create("captionOff", notifOption, (e) => {
        console.log(e);
      });
    }
  }
  if (result.startRecordNote) {
    if (result.startRecordNote.newValue) {
      // chrome.notifications.clear("startRecord");
      chrome.notifications.getAll((items) => {
        if (items) for (let key in items) chrome.notifications.clear(key);
      });
      var notifOption = {
        iconUrl: "http://www.google.com/favicon.ico",
        type: "basic",
        iconUrl: "round-table.png",
        title: "Started!",
        message: "Your mental score is being tracked!",
      };
      chrome.notifications.create("startRecord", notifOption);
    }
  }
});
