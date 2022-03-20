const EMOTIONS = [
  128547, 128542, 128543, 128577, 128529, 128528, 128578, 128516, 128518,
  128526,
];
const POSITIVE_EMO = [
  "Admiration",
  "Amusement",
  "Calmness",
  "Excitement",
  "Gratitude",
  "Joy",
  "Love",
];

const NEGATIVE_EMO = ["Anger", "Boredom", "Disgust", "Fear", "Sadness"];
const EMO_SUMMARY = [
  "Ambifeel",
  "Badfeel",
  "Goodfeel",
  "Sentiment",
  "Emotionality",
  "Non-emotion",
];

chrome.identity.getProfileUserInfo(function (userInfo) {
  console.log(userInfo);
  $("#userEmail").html(userInfo.email);
  $("#greetingLine").css("display", "block");
});

chrome.storage.sync.get(["subtitleWarning"], function (result) {
  if (result.subtitleWarning) {
    $("#captions-off").css("display", "block");
  } else {
    $("#captions-off").css("display", "none");
  }
});

chrome.storage.sync.get(["isCallEnd"], function (result) {
  console.log("grab result ", result);
  if (result.isCallEnd) {
    console.log("ending");
    handleEndCall();
    /*     var score = 80;
    chrome.storage.sync.set({
      score: score,
    }); */

    /*     chrome.storage.sync.get(["score"], function (output) {
      if (output.score === undefined) {

      } else {
        console.log("value of score", output.score);
        var score = output.score;
        $("#start-record").css("display", "none");
        $("#end-record").css("display", "block");
        move(score);
      }
    }); */
  }
});

function handleEndCall() {
  chrome.storage.sync.get(["script", "meet_code"], function (output) {
    const conversationMap = new Map();

    for (var i = 0; i < output.script.length; i++) {
      var res = output.script[i].split(":");
      if (res.length > 1) {
        var name = res[0].trim();
        var conversation = res[1];
        if (conversationMap.get(name)) {
          conversationMap.set(
            name,
            conversationMap
              .get(name)
              .concat(" ", conversation)
              .replaceAll("\r\n")
          );
        } else {
          conversationMap.set(name, conversation.replaceAll("\r\n"));
        }
      }
    }

    console.log(conversationMap);
    console.log(conversationMap.get("You"));

    const url = "https://api.receptiviti.com/v1/score";
    const data = {
      request_id: "req-1",
      content: conversationMap.get("You"),
    }; // conversationMap.get("You")

    axios
      .post(url, data, {
        auth: {
          username: "b669d0af6ee3432db45ebe5634a8dca1",
          password: "PULYnWSbqhR9UM+/WdBWLfhMdT9uSHzokm2xE6iA0Lq5QC/kizTwbyBG",
        },
      })
      .then((response) => {
        console.log("data", response.data);
        var goodfeel = response.data.results[0].dictionary_measures.goodfeel;
        var badfeel = response.data.results[0].dictionary_measures.badfeel;
        console.log("data", goodfeel);
        console.log("data", badfeel);
        response = response.data;
        /* chrome.storage.sync.set({
          score: 10,
        }); */
        var score = Math.ceil(((goodfeel - badfeel + 0.2) / 0.5) * 100);
        $("#start-record").css("display", "none");
        $("#end-record").css("display", "block");
        move(score);
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

var i = 0;
function move(score) {
  var actualScore = score;
  console.log(actualScore);
  if (actualScore < 0) {
    actualScore = 0;
  }
  if (actualScore > 100) {
    actualScore = 99;
  }
  console.log(actualScore);
  if (i == 0) {
    i = 1;
    var elem = document.getElementById("myBar");
    var emoji = document.getElementById("emo");
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= actualScore) {
        clearInterval(id);
        i = 0;
      } else {
        width++;
        var emojiStr = "&#" + EMOTIONS[Math.floor(width / 10)];
        console.log(emojiStr);
        emoji.innerHTML = emojiStr;
        elem.style.width = width + "%";
      }
    }
  }
}
