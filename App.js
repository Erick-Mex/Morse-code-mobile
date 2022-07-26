import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, TextInput, Button } from "react-native";
import tw from "twrnc";
import morseSound from './assets/morseSound.mp3';

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
  ' ': '//' //space
};

var Sound = require('react-native-sound')

Sound.setCategory('Playback');

var sound = new Sound('whoosh.mp3', Sound.MAIN_BUNDLE, (error) => {
  if(error) {
    console.log('failed to load the sound');
    return;
  }
  console.log('duration in seconds' + sound.getDuration());

  sound.play(() => {
    sound.release();
  })
})

export default function App() {
  const [Morse, setMorse] = useState("");
  const [sentence, setSentence] = useState("");

  const validateText = (word) => {
    const regExp = /^[a-zA-Z\s]+$/;
    const result = regExp.test(word);
    return result;
  };

  const playAudio = () => {
    /*
    const t = CTX.currentTime;

    const oscillator = CTX.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 600;

    const gainNode = CTX.createGain();
    gainNode.gain.setValueAtTime(0, t);

    for(var i = 0; i < Morse.length; i++) {
      let letter = Morse[i];
      switch(letter) {
        case ".":
          gainNode.gain.setValueAtTime(1, t);
          t += DOT;
          gainNode.gain.setValueAtTime(0, t);
          t += DOT;
          break;
        case "-":
          gainNode.gain.setValueAtTime(1, t);
          t += 3 * DOT;
          gainNode.gain.setValueAtTime(0, t);
          t += DOT;
          break;
        case " ":
          t += 7 * DOT;
          break;
      }
    }

    oscillator.connect(gainNode);
    gainNode.connect(CTX.destination);

    oscillator.start();

    return false;
    */
  }

  useEffect(() => {
    const text = sentence.toLowerCase();
    let result = "";

    if (text.length == 0) setMorse("");
    if (!validateText(text)) return;

    for(var i = 0; i < text.length; i++) {
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
          style={tw`border-solid border border-black rounded-lg p-2 mb-4`}
          placeholder="example: SOS"
          onChangeText={(newText) => setSentence(newText)}
        />
        <Button
        title="Play"
        onPress={playAudio}
        />
        <Text style={tw`font-bold text-lg`}>The Morse Code:</Text>
        <Text style={tw`text-xl`}>{Morse}</Text>
      </View>
    </SafeAreaView>
  );
}
