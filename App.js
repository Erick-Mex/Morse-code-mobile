import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableHighlight,
} from "react-native";
import tw from "twrnc";
import { Audio } from "expo-av";
import dot from "./assets/dot.mp3";
import dash from "./assets/dash.mp3";
import Icon from "react-native-vector-icons/FontAwesome";

const MORSE_MAP = {
  a: ".-", //A
  b: "-...", //B
  c: "-.-.", //C
  d: "-..", //D
  e: ".", //E
  f: "..-.", //F
  g: "--.", //G
  h: "....", //H
  i: "..", //I
  j: ".---", //J
  k: "-.-", //K
  l: ".-..", //L
  m: "--", //M
  n: "-.", //N
  o: "---", //O
  p: ".--.", //P
  q: "--.-", //Q
  r: ".-.", //R
  s: "...", //S
  t: "-", //T
  u: "..-", //U
  v: "...-", //V
  w: ".--", //W
  x: "-..-", //X
  y: "-.--", //Y
  z: "--..", //Z
  " ": "//", //space
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function App() {
  const [Morse, setMorse] = useState("");
  const [sentence, setSentence] = useState("");
  const sound = new Audio.Sound();
  let query = [];

  const validateText = (word) => {
    const regExp = /^[a-zA-Z\s]+$/;
    const result = regExp.test(word);
    return result;
  };

  const playAudio = async () => {
    let MorseCodes = Morse.split("//");

    MorseCodes.map((code, index) => {
      for (let i = 0; i < code.length; i++) {
        let letter = code[i];
        if (letter == ".") query.push(dot);
        else query.push(dash);
      }

      if (index < MorseCodes.length - 1) query.push("space");
    });

    let first = query.shift();
    await sound.loadAsync(first);
    await sound.playAsync();
  };

  sound.setOnPlaybackStatusUpdate(async (playbackStatus) => {
    if (!playbackStatus.isLoaded) {
      if (playbackStatus.error) console.log("Error: " + playbackStatus.error);
    } else {
      if (playbackStatus.didJustFinish) {
        sound.unloadAsync();

        if (query.length == 0) return;

        let first = query.shift();
        if (first == "space") {
          await sleep(200);
          first = query.shift();
          await sound.loadAsync(first);
          await sound.playAsync();
        } else {
          sleep(120); //sleep between dots and dashes
          await sound.loadAsync(first);
          await sound.playAsync();
        }
      }
    }
  });

  useEffect(() => {
    const text = sentence.toLowerCase();
    let result = "";

    if (text.length === 0) setMorse("");
    if (!validateText(sentence)) return;

    for (var i = 0; i < text.length; i++) {
      let morseCode = MORSE_MAP[text[i]];
      result += morseCode;
    }
    setMorse(result);
  }, [sentence]);

  return (
    <SafeAreaView>
      <StatusBar hidden={true} />
      <Text style={tw`text-4xl font-bold text-center m-4`}>Morse Code</Text>
      <View style={tw`m-4`}>
        <Text style={tw`font-bold text-lg`}>Write something:</Text>
        <TextInput
          style={tw`border-solid border ${
            !sentence || validateText(sentence)
              ? "border-black"
              : "border-red-400"
          } rounded-lg p-2`}
          placeholder="example: SOS"
          onChangeText={(newText) => setSentence(newText)}
        />
        {sentence && !validateText(sentence) ? (
          <Text style={tw`text-red-400`}>Only use letters (a-z)</Text>
        ) : null}
        <View style={tw`my-4`}>
          <TouchableHighlight style={tw`rounded-full`} onPress={playAudio}>
            <View
              style={[
                tw`flex-row justify-center p-2 rounded-full`,
                styles.button,
              ]}
            >
              <Icon
                name="play"
                size={30}
                style={styles.verticalCenter}
                color={"#ffff"}
              />
              <Text style={[styles.verticalCenter, tw`text-lg p-1 text-white`]}>
                Play
              </Text>
            </View>
          </TouchableHighlight>
        </View>
        <Text style={tw`font-bold text-lg`}>The Morse Code:</Text>
        <Text style={tw`text-xl`}>{Morse}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  verticalCenter: {
    textAlignVertical: "center",
  },
  button: {
    backgroundColor: "#75c4f9",
  },
});
