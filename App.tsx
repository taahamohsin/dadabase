import React, {useEffect, useState} from 'react';
import {
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  View,
  SafeAreaView,
} from 'react-native';
import {
  Provider,
  Flex,
  Button,
  Card,
  Modal,
  Switch,
  WhiteSpace,
  WingBlank,
} from '@ant-design/react-native';
import Sound from 'react-native-sound';

import {api} from './utils/api.ts';
import Dolphin from './ios/Dadabase/Images.xcassets/dolphin.imageset/dolphin.png';
import dolphinLaugh from './ios/dolphin.m4a';
import tromboneSound from './ios/trombone.mp3';

const customIcon = (
  <Image
    source={{
      uri: 'https://zos.alipayobjects.com/rmsportal/bRnouywfdRsCcLU.png',
    }}
    style={{width: 18, height: 18}}
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

const toggleSound = (onChange, checked) => (
  <Switch
    onChange={onChange}
    checked={checked}
    style={{alignSelf: 'end'}}
    defaultChecked
  />
);

function App(): JSX.Element {
  const [jokes, setJokes] = useState<Array<Joke> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(true);
  const {height, width} = useWindowDimensions();

  useEffect(() => {
    const getJokes = async () => {
      if (jokes?.length === 0) {
        const data = await getRandomDadJoke(setIsLoading, setShowError);
        const dadJokes = data.map(elem => elem.joke);
        setJokes(dadJokes);
      }
    };
    getJokes();
  }, [jokes, setJokes, setIsLoading, setShowError]);

  useEffect(() => {
    if (!showError && isSoundOn && jokes?.length > 0) {
      laugh.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    }
  }, [jokes, isSoundOn, showError]);

  const styles = StyleSheet.create({
    page: {
      height: '100vh',
      backgroundColor: '#F4D545',
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
      backgroundColor: '#4564F4',
      borderColor: '#F4D545',
      borderRadius: 20,
      width: 'fit-content',
    },
    cardBody: {
      padding: 10,
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
      flex: 1,
    },
    header: {
      fontFamily: 'Poppins-Light',
      fontWeight: 900,
      color: 'white',
      fontSize: 18,
    },
    jokeButtonContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <Provider>
      <SafeAreaView>
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
              <Flex wrap="wrap" direction="column">
                <>
                  {!isModalOpen && (
                    <Flex
                      justify="end"
                      style={{
                        width: '100%',
                        alignSelf: 'flex-end',
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: 18,
                          fontFamily: 'Poppins-Light',
                        }}>
                        Toggle sound
                      </Text>
                      <WingBlank size="md">
                        {toggleSound(setIsSoundOn, isSoundOn)}
                      </WingBlank>
                    </Flex>
                  )}
                </>
                {!isModalOpen && (
                  <Flex.Item style={styles.jokeButtonContainer}>
                    {showError && (
                      <Card
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                          height: 100,
                          backgroundColor: '#F03737',
                        }}
                        full>
                        <Card.Header
                          title={
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginLeft: -5,
                              }}>
                              {customIcon}
                              <WingBlank size="md">
                                <Text style={styles.header}>Error</Text>
                              </WingBlank>
                            </View>
                          }
                        />
                        <Card.Body>
                          <WingBlank>
                            <Text style={styles.text}>
                              {`Uh oh! Doo-dun-diddly failed to fetch you ${
                                jokes ? 'another' : 'a'
                              } dad joke. Please try again and text me if it still doesn't work.`}
                            </Text>
                          </WingBlank>
                        </Card.Body>
                      </Card>
                    )}
                    <WhiteSpace />
                    {jokes?.length > 0 && (
                      <View style={styles.card}>
                        <WhiteSpace />
                        <WingBlank>
                          <Text style={styles.text}>{jokes}</Text>
                        </WingBlank>
                        <WhiteSpace />
                      </View>
                    )}
                    <WhiteSpace />
                    <View>
                      <Button
                        type="primary"
                        style={styles.button}
                        onPress={() => {
                          if (showError) {
                            setShowError(false);
                          }
                          setJokes([]);
                        }}>
                        <Text style={styles.text}>{`Press me for ${
                          jokes ? 'another' : 'a'
                        } dad joke!`}</Text>
                      </Button>
                      {!isModalOpen && jokes?.length > 0 && (
                        <>
                          <WhiteSpace />
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
                            }}>
                            <Text style={styles.text}>
                              Press me for a bonus joke!
                            </Text>
                          </Button>
                        </>
                      )}
                    </View>
                  </Flex.Item>
                )}
                {jokes?.length > 0 && !isModalOpen && (
                  <>
                    <WhiteSpace />
                    <Image source={Dolphin} style={styles.picture} />
                  </>
                )}
              </Flex>
            </>
          )}
        </Flex>
      </SafeAreaView>
    </Provider>
  );
}

export default App;
