import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

const TensorCamera = cameraWithTensors(Camera);

export default function App() {
    const [hasPermission, setHasPermission] = useState(null);
    const [model, setModel] = useState(null);
    const [prediction, setPrediction] = useState('');

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');

            // Initialize TensorFlow
            await tf.ready();

            // Load MobileNet model
            const loadedModel = await mobilenet.load();
            setModel(loadedModel);
        })();
    }, []);

    const handleCameraStream = (images) => {
        const loop = async () => {
            if (model) {
                const nextImageTensor = images.next().value;
                if (nextImageTensor) {
                    const predictions = await model.classify(nextImageTensor);
                    if (predictions && predictions.length > 0) {
                        setPrediction(
                            `${predictions[0].className} (${Math.round(predictions[0].probability * 100)}%)`
                        );
                    }
                    tf.dispose(nextImageTensor);
                }
            }
            requestAnimationFrame(loop);
        };
        loop();
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <TensorCamera
                style={styles.camera}
                type={Camera.Constants.Type.back}
                onReady={handleCameraStream}
                resizeHeight={200}
                resizeWidth={152}
                resizeDepth={3}
                autorender={true}
            />
            <View style={styles.predictionBox}>
                <Text style={styles.predictionText}>
                    {prediction || 'Analyzing...'}
                </Text>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    predictionBox: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 15,
        borderRadius: 10,
    },
    predictionText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
});
