import React, {useEffect, useState} from 'react';
import {
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import {Provider, Flex, Button, Card} from '@ant-design/react-native';
import Sound from 'react-native-sound';

import {api} from './utils/api.ts';
import Dolphin from './ios/Dadabase/Images.xcassets/dolphin.imageset/dolphin.png';
import dolphinLaugh from './ios/dolphin.m4a';

const {getRandomDadJoke} = api;

Sound.setCategory('Playback');
const laugh = new Sound(dolphinLaugh, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // when loaded successfully
  console.log(
    'duration in seconds: ' +
      laugh.getDuration() +
      'number of channels: ' +
      laugh.getNumberOfChannels(),
  );
});
laugh.setVolume(1);

type Joke = {
  joke: string;
};

function App(): JSX.Element {
  const [jokes, setJokes] = useState<Array<Joke> | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {height, width} = useWindowDimensions();

  useEffect(() => {
    const getJokes = async () => {
      if (!jokes) {
        const data = await getRandomDadJoke(setIsLoading);
        const dadJokes = data.map(elem => elem.joke);
        setJokes(dadJokes);
        console.log('GOT HERE');
        laugh.play(success => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      }
    };
    getJokes();
  }, [jokes, setJokes]);

  const styles = StyleSheet.create({
    page: {
      height,
      backgroundColor: '#F4D545',
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '50%',
    },
    element: {
      flex: 1,
      alignSelf: 'center',
    },
    picture: {
      width: '100%',
      height: undefined,
      aspectRatio: 1.3,
    },
    card: {
      minHeight: 0,
      backgroundColor: '#4564F4',
      borderColor: '#F4D545',
      borderRadius: 20,
    },
    cardBody: {
      padding: 10,
      flexGrow: 0,
    },
    text: {
      color: 'white',
      fontFamily: 'Poppins-Light',
      fontWeight: 700,
    },
    button: {
      backgroundColor: '#4564F4',
      fontFamily: 'Poppins-Light',
      fontWeight: 700,
    },
    loading: {
      height,
      width,
      backgroundColor: '#4564F4',
    },
  });

  return (
    <Provider>
      <Flex
        direction="column"
        justify="center"
        align="center"
        style={styles.page}>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="white"
            style={styles.loading}
            animating
            toast
          />
        ) : (
          <Flex
            wrap="wrap"
            direction="column"
            justify="center"
            align="center"
            style={styles.container}>
            {jokes?.length > 0 && (
              <Flex.Item style={styles.element}>
                <Card style={styles.card}>
                  <Card.Body style={styles.cardBody}>
                    <Text style={styles.text}>{jokes}</Text>
                  </Card.Body>
                </Card>
              </Flex.Item>
            )}

            <Flex.Item style={styles.element}>
              <Button
                type="primary"
                style={styles.button}
                onPress={() => {
                  setJokes(null);
                }}>
                Press me for a dad joke!
              </Button>
            </Flex.Item>
            {jokes?.length > 0 && (
              <Flex.Item style={styles.element}>
                <Image source={Dolphin} style={styles.picture} />
              </Flex.Item>
            )}
          </Flex>
        )}
      </Flex>
    </Provider>
  );
}

export default App;
