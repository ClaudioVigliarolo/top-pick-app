import React from 'react';
import {View, ScrollView} from 'react-native';
import ListeItemCheck from '../../../../components/lists/ListeItemCheck';
import styles from '../../../../styles/styles';
import PushNotification, {
  PushNotificationScheduleObject,
} from 'react-native-push-notification';
import {NotificationTime} from '../../../../interfaces/Interfaces';
import {
  getStorageNotification,
  setStorageNotification,
} from '../../../../utils/storage/storage';

export interface NotificationOption {
  id: number;
  title: string;
  value: PushNotificationScheduleObject;
}

const now = new Date();

const notificationDaily: PushNotificationScheduleObject = {
  channelId: 'default',
  id: 0,
  title: 'Topic of the Day',
  repeatType: 'day',
  message: 'Check out the Topic of the Day', // (required)
  date: new Date(now.getTime() + 24 * 60 * 60 * 1000), //new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
};

const notificationWeekly: PushNotificationScheduleObject = {
  channelId: 'default',
  id: 1,
  title: 'Topic of the Week',
  repeatType: 'week',
  message: 'Check out the Topic of the Day', // (required)
  date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
};

export default function SelectThemePage() {
  const [
    currentNotificationId,
    setCurrentNotificationId,
  ] = React.useState<number>(NotificationTime.WEEKLY);

  const notificationOptions: NotificationOption[] = [
    {title: 'Daily', value: notificationDaily, id: NotificationTime.DAILY},
    {title: 'Weekly', value: notificationWeekly, id: NotificationTime.WEEKLY},
  ];

  React.useEffect(() => {
    (async () => {
      const id = await getStorageNotification();
      if (id !== null) {
        setCurrentNotificationId(id);
      }
    })();
  }, []);

  const onChangeNotifications = async (index: number) => {
    PushNotification.cancelAllLocalNotifications();
    PushNotification.localNotificationSchedule(
      notificationOptions[index].value,
    );
    setCurrentNotificationId(notificationOptions[index].id);
    setStorageNotification(notificationOptions[index].id);
  };

  const onNotificationNever = async () => {
    PushNotification.cancelAllLocalNotifications();
    setCurrentNotificationId(NotificationTime.NEVER);
    setStorageNotification(NotificationTime.NEVER);
  };

  return (
    <ScrollView style={styles.DefaultContainer}>
      {notificationOptions.map((theme: NotificationOption, index) => (
        <View key={index}>
          <ListeItemCheck
            selected={theme.id === currentNotificationId}
            text={theme.title}
            onPress={() => onChangeNotifications(index)}
          />
        </View>
      ))}
      <View>
        <ListeItemCheck
          selected={currentNotificationId === NotificationTime.NEVER}
          text="Never"
          onPress={onNotificationNever}
        />
      </View>
    </ScrollView>
  );
}
