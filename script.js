let maxChars = document.getElementById("numberInput").value
let text

function init() {
  document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
}

function handleFileSelect(event) {
  const reader = new FileReader()
  reader.onload = handleFileLoad;
  reader.readAsText(event.target.files[0])
}

function handleFileLoad(event) {
  text = event.target.result;
}


function handleData() {
  // Split the text by /n, remove nulls
  splitText = text.split(/\r?\n/).filter(n => n)
  try {
    let shortSplitLines = []
    for (let i = 0; i < splitText.length; i += 2) {
      
        polishText = splitText[i]
        englishText = splitText[i + 1]
      try {
        longestText = Math.max(polishText.length, englishText.length)
        numberOfParts = Math.ceil(longestText / maxChars);
        throw("Ouch!")
        shortSplitLines[i] = splitIntoNParts(polishText, numberOfParts)
        shortSplitLines[i + 1] = splitIntoNParts(englishText, numberOfParts)
      } catch(err) {
        alert("Something went wrong, but I'll keep going but some lines but be unchanged.  Check the console for errors.")
        console.log("Messed up the following subtitles:\n" + polishText + "\n" + englishText + "\n\nWith error:\n" + err)
        shortSplitLines[i] = [polishText]
        shortSplitLines[i + 1] = [englishText]
      }
    }

    const zippedArray = []
    for(let i = 0; i < shortSplitLines.length; i += 2) {
      for(let j = 0; j < shortSplitLines[i].length; j++) {
        zippedArray.push(shortSplitLines[i][j])
        zippedArray.push(shortSplitLines[i + 1][j])
        zippedArray.push("")
      }
    }

    outputText = zippedArray.join("\n")
    writeToTextFile(outputText, 'output.txt');
  } catch(err) {
    alert("Something went really wrong, ask Eric")
    console.log(err)
  }
}

  function appendLines(arr, lines, index) {
    if(arr[index] == undefined) {
      arr[index] = lines
    } else {
      arr[index] = arr[index].append(lines)
    }
  }

  const writeToTextFile = (text, fileName) => {
    let textFile = null;
    const makeTextFile = (text) => {
      const data = new Blob([text], {
        type: 'text/plain',
      });
      if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
      }
      textFile = window.URL.createObjectURL(data);
      return textFile;
    };
    const link = document.createElement('a');
    link.setAttribute('download', fileName);
    link.href = makeTextFile(text);
    link.click();
  };

  // Splits a line of text into N roughly equal parts
  function splitIntoNParts(str, n) {
    let words = str.split(" ");
    let totalLength = str.length;
    let avgLength = Math.ceil(totalLength / n); // Target length per chunk
    let result = [];
    let currentChunk = "";
    
    for (let word of words) {
        if ((currentChunk + " " + word).trim().length > avgLength && result.length < n - 1) {
            result.push(currentChunk);
            currentChunk = word;
        } else {
            currentChunk += (currentChunk.length ? " " : "") + word;
        }
    }

    result.push(currentChunk);

    return result;
}