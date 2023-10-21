import React, {useEffect, useState} from 'react';
import {
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Provider,
  Flex,
  Button,
  Card,
  Modal,
  NoticeBar,
} from '@ant-design/react-native';
import Sound from 'react-native-sound';

import {api} from './utils/api.ts';
import Dolphin from './ios/Dadabase/Images.xcassets/dolphin.imageset/dolphin.png';
import dolphinLaugh from './ios/dolphin.m4a';
import tromboneSound from './ios/trombone.mp3';

const customIcon = (
  <Image
    // tslint:disable-next-line:jsx-no-multiline-js
    source={{
      uri: 'https://zos.alipayobjects.com/rmsportal/bRnouywfdRsCcLU.png',
    }}
    style={{width: 12, height: 12}}
  />
);

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
const trombone = new Sound(tromboneSound, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // when loaded successfully
  console.log(
    'duration in seconds: ' +
      trombone.getDuration() +
      'number of channels: ' +
      trombone.getNumberOfChannels(),
  );
});
trombone.setVolume(1);

type Joke = {
  joke: string;
};

function App(): JSX.Element {
  const [jokes, setJokes] = useState<Array<Joke> | null>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const {height, width} = useWindowDimensions();

  useEffect(() => {
    const getJokes = async () => {
      if (!jokes) {
        const data = await getRandomDadJoke(setIsLoading, setShowError);
        const dadJokes = data.map(elem => elem.joke);
        setJokes(dadJokes);
      }
    };
    getJokes();
  }, [jokes, setJokes, showError]);

  useEffect(() => {
    if (!showError && jokes?.length > 0) {
      laugh.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    }
  }, [jokes, showError]);

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
      justifyContent: 'center',
    },
    text: {
      color: 'white',
      fontFamily: 'Poppins-Light',
      fontWeight: 700,
      textAlign: 'center',
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
    modal: {
      borderRadius: 20,
      backgroundColor: '#4564F4',
    },
    modalText: {
      fontFamily: 'Poppins-Light',
      fontSize: 20,
      color: 'white',
      textAlign: 'center',
    },
    bonusJokeButton: {
      marginBottom: 20,
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
          <>
            <Flex
              wrap="wrap"
              direction="column"
              justify="center"
              align="center"
              style={styles.container}>
              <Modal
                title=""
                onClose={() => setIsModalOpen(false)}
                visible={isModalOpen}
                closable
                style={styles.modal}
                transparent>
                <View
                  style={{
                    paddingVertical: 50,
                  }}>
                  <Text style={styles.modalText}>Made you look! &#128514;</Text>
                </View>
              </Modal>
              {showError && (
                <NoticeBar
                  mode="closable"
                  icon={customIcon}
                  onPress={() => setShowError(false)}
                  marqueeProps={{
                    loop: false,
                  }}>
                  {/* <Text style={[styles.text, {color: 'black', fontSize: 13}]}> */}
                  Uh oh! We doo-dun-diddly failed to fetch you a dad joke.
                  Please try again latte.
                  {/* </Text> */}
                </NoticeBar>
              )}
              {!isModalOpen && jokes?.length > 0 && (
                <>
                  <Button
                    type="primary"
                    onPress={() => {
                      setIsModalOpen(true);
                      trombone.play(success => {
                        if (success) {
                          console.log('successfully finished playing');
                        } else {
                          console.log(
                            'playback failed due to audio decoding errors',
                          );
                        }
                      });
                    }}
                    style={styles.bonusJokeButton}>
                    <Text style={styles.text}>Press me for a bonus joke!</Text>
                  </Button>
                  {
                    <Flex.Item style={styles.element}>
                      <Card style={styles.card}>
                        <Card.Body style={styles.cardBody}>
                          <Text style={styles.text}>{jokes}</Text>
                        </Card.Body>
                      </Card>
                    </Flex.Item>
                  }
                </>
              )}

              {!isModalOpen && (
                <Flex.Item style={styles.element}>
                  <Button
                    type="primary"
                    style={styles.button}
                    onPress={() => {
                      setJokes(null);
                    }}>
                    <Text style={styles.text}>{`Press me for ${
                      jokes?.length === 0 ? 'a' : 'another'
                    } dad joke!`}</Text>
                  </Button>
                </Flex.Item>
              )}

              {jokes?.length > 0 && !isModalOpen && (
                <Flex.Item style={styles.element}>
                  <Image source={Dolphin} style={styles.picture} />
                </Flex.Item>
              )}
            </Flex>
          </>
        )}
      </Flex>
    </Provider>
  );
}

export default App;
