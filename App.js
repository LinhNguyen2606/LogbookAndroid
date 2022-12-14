import React, {useState, useEffect} from 'react';
import {
  Image,
  Button,
  View,
  Text,
  SafeAreaView,
  TextInput,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'LogBookDatabase.db'});

const App = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const [url, setUrl] = useState('');
  const [newArray, setNewArray] = useState([]);

  const forwardBtn = () => {
    if (imageIndex > newArray.length - 2) {
      setImageIndex(0);
    } else {
      setImageIndex(prev => imageIndex + 1);
    }
  };

  const backwardBtn = () => {
    if (imageIndex < newArray.length - 1) {
      setImageIndex(newArray.length - 1);
    } else {
      setImageIndex(prev => imageIndex - 1);
    }
  };

  useEffect(() => {
    db.transaction(function (txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='logBookAndroid'",
        [],
        function (tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS logBookAndroid', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS logBookAndroid(id INTEGER PRIMARY KEY AUTOINCREMENT, image_url VARCHAR(255))',
              [],
            );
          }
        },
      );
    });
    handleSubmitBtn();
    requestPermission();
  }, []);

  const insertImage = () => {
    if (url.match(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g) === null) {
      Alert.alert('Image url is invalid!');
      return;
    } else {
      db.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO logBookAndroid (image_url) VALUES (?)',
          [url],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              Alert.alert('Image Inserted Successfully....');
            } else Alert.alert('Failed....');
          },
        );
      });
      handleSubmitBtn();
    }
  };

  const handleSubmitBtn = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM logBookAndroid', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i)
          temp.push(results.rows.item(i));
        setUrl('');
        setNewArray(temp);
        console.log(temp);
      });
    });
  };

  const requestPermission = async () => {
    try {
      const grantedCamera = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      const grantedGallery = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Photo Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (
        grantedCamera === PermissionsAndroid.RESULTS.GRANTED &&
        grantedGallery === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const openCamera = async () => {
    const result = await launchCamera({
      includeBase64: true,
      saveToPhotos: true,
    });
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO logBookAndroid (image_url) VALUES (?)',
        ['data:image/jpg;base64,' + result.assets[0].base64],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert('Image Inserted Successfully....');
          } else Alert.alert('Failed....');
        },
      );
    });
    handleSubmitBtn();
    console.log(result);
  };

  return (
    <>
      <View>
        <Text
          style={{
            textAlign: 'center',
            backgroundColor: '#156dc3',
            padding: 20,
            color: 'white',
            fontWeight: 'bold',
            fontSize: 18,
          }}>
          Pictures
        </Text>

        <SafeAreaView>
          <TextInput
            style={{
              backgroundColor: '#CCCCFF',
              color: '#000',
              margin: 20,
              paddingLeft: 10,
              borderRadius: 10,
            }}
            selectTextOnFocus={true}
            onChangeText={item => setUrl(item)}
            keyboardType={'url'}
            value={url}
            placeholder="Enter URL..."
          />
          <View style={{width: '90%', marginLeft: 20}}>
            <Button title="Upload image" onPress={insertImage}></Button>
          </View>
        </SafeAreaView>

        {newArray && newArray.length == 0 ? (
          <Text
            style={{marginBottom: 100, textAlign: 'center', marginTop: 100}}>
            No data available...
          </Text>
        ) : (
          <Image
            style={{
              height: 200,
              width: 300,
              marginTop: 40,
              marginBottom: 0,
              marginLeft: 45,
              padding: 5,
              objectFit: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              borderRadius: 10,
            }}
            source={{uri: newArray[imageIndex].image_url}}
          />
        )}

        <View
          style={{
            display: 'flex',
            position: 'relative',
            bottom: 120,
            width: '95%',
            left: 16,
            right: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Button title="Before" onPress={backwardBtn} />
          <Button title="Next" onPress={forwardBtn} />
        </View>
        <View style={{width: '90%', marginLeft: 20}}>
          <Button title="Take a picture" onPress={openCamera}></Button>
        </View>
      </View>
    </>
  );
};

export default App;
