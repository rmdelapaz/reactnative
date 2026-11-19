import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { PermissionGate } from '@/components/PermissionGate';
import { PhotoStrip } from '@/components/PhotoStrip';
import { usePermission } from '@/hooks/usePermission';
import type { LogPhoto } from '@/state/logQueue';
import { spacing } from '@/theme/spacing';
import { forgetPhoto, keepPhoto } from '@/utils/photoFiles';

const maxPhotos = 3;
// What shoreline-api takes (POST /api/photos answers 415 and 413 otherwise)
const photoTypes = ['image/jpeg', 'image/png', 'image/webp'];
const maxBytes = 5 * 1024 * 1024;

// Small files for one bar of signal: JPEG at 60% quality, no EXIF data (it can hold where and
// when the photo was taken), and on an iPhone a JPEG copy of a HEIC photo
const pickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  quality: 0.6,
  exif: false,
  preferredAssetRepresentationMode:
    ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
};

// Said before the phone's camera question (Lesson 6.1's gate)
const cameraReason =
  'Shoreline Crew opens the camera only when you press Take a photo, to photograph what you ' +
  'collected. Your photos go to the server with your log, nowhere else.';

type LogPhotosProps = {
  photos: LogPhoto[];
  onChange: (photos: LogPhoto[]) => void;
};

// "Photos (optional)" on the debris log: take one with the camera (asks for permission first) or
// choose from the photo library (no permission needed), see them, take them out again
export function LogPhotos({ photos, onChange }: LogPhotosProps) {
  // Reading the camera answer asks nobody (Lesson 6.1): read it now, so a yes from before
  // opens the camera at once
  const camera = usePermission(ImagePicker.useCameraPermissions());
  const [askingCamera, setAskingCamera] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const room = maxPhotos - photos.length;

  // Keep the photos the server will take; say so when one does not fit
  async function add(result: ImagePicker.ImagePickerResult) {
    setAskingCamera(false);
    if (result.canceled) {
      return; // the volunteer closed the camera or the library without a photo
    }
    const added: LogPhoto[] = [];
    let refused = 0;
    for (const asset of result.assets.slice(0, room)) {
      const type = asset.mimeType ?? '';
      const kept = await keepPhoto(asset.uri);
      if (photoTypes.includes(type) && kept.bytes <= maxBytes) {
        added.push({ uri: kept.uri, type, photoId: null });
      } else {
        forgetPhoto(kept.uri);
        refused += 1;
      }
    }
    setProblem(
      refused === 0
        ? null
        : `${refused === 1 ? 'One photo was' : `${refused} photos were`} not added: ` +
            'the server takes JPEG, PNG or WebP photos of 5 MB or smaller.',
    );
    onChange([...photos, ...added]);
  }

  async function openCamera() {
    await add(await ImagePicker.launchCameraAsync(pickerOptions));
  }

  async function choosePhotos() {
    await add(
      await ImagePicker.launchImageLibraryAsync({
        ...pickerOptions,
        allowsMultipleSelection: true,
        selectionLimit: room, // the library stops the volunteer at the room that is left
      }),
    );
  }

  // Straight to the camera after a yes; otherwise the permission step first
  function takePhoto() {
    if (camera.step === 'granted') {
      void openCamera();
    } else {
      setAskingCamera(true);
    }
  }

  function removePhoto(uri: string) {
    forgetPhoto(uri);
    onChange(photos.filter((photo) => photo.uri !== uri));
  }

  return (
    <View style={styles.box}>
      <AppText variant="heading" accessibilityRole="header">
        Photos (optional)
      </AppText>
      <AppText variant="muted">
        Up to {maxPhotos} photos of what you collected. They are sent with the log.
      </AppText>
      <PhotoStrip photos={photos} onRemove={removePhoto} />
      {problem !== null && (
        <AppText variant="error" accessibilityRole="alert">
          {problem}
        </AppText>
      )}
      {askingCamera ? (
        <PermissionGate
          permission={camera}
          what="your camera"
          why={cameraReason}
          onNotNow={() => setAskingCamera(false)}
        >
          <Button label="Open the camera" variant="primary" onPress={() => void openCamera()} />
        </PermissionGate>
      ) : (
        room > 0 && (
          <View style={styles.actions}>
            <Button label="Take a photo" onPress={takePhoto} />
            <Button label="Choose photos" onPress={() => void choosePhotos()} />
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
