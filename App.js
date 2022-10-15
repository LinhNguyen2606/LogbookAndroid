import React, {useState} from 'react';
import {Image, Button, View, Text} from 'react-native';

const App = () => {
  const [imageIndex, setImageIndex] = useState(0);

  const imagesList = [
    'https://miluxinh.com/wp-content/uploads/2020/09/cho-poodle-co-may-loai.jpg',
    'https://cdn.tgdd.vn/Files/2021/04/15/1343612/tim-hieu-giong-cho-poodle-nguon-goc-dac-diem-cach-nuoi-bang-gia-202104151447536289.jpg',
  ];

  const forwardBtn = () => {
    if (imageIndex > imagesList.length - 2) {
      setImageIndex(0);
    } else {
      setImageIndex(prev => imageIndex + 1);
    }
  };

  const backwardBtn = () => {
    if (imageIndex < imagesList.length - 1) {
      setImageIndex(imagesList.length - 1);
    } else {
      setImageIndex(prev => imageIndex - 1);
    }
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

        <Image
          style={{
            height: 200,
            width: 300,
            marginTop: 80,
            marginBottom: 0,
            marginLeft: 45,
            padding: 5,
            objectFit: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            borderradius: 8,
            border: '1 solid #ddd',
            transition: 'width 2s',
          }}
          source={{uri: imagesList[imageIndex]}}
        />
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
      </View>
    </>
  );
};

export default App;
