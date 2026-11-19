import { Text, View } from 'react-native';

import { signedUp } from './shifts';

// TODO 2: a FlatList of the volunteers (name, and the shift's label under it), keys from the id, a switch
// "Only repair tables" (accessibilityLabel) above them, and the count: "4 volunteers", or "2 of 4 volunteers"
// while the switch is on.
// TODO 3: a name field (accessibilityLabel "Volunteer name") and an "Add volunteer" button that adds a
// repair-table volunteer and clears the field; with no name, the message "Type a name first." (role alert).
export function SignUpList() {
  return (
    <View>
      <Text>{signedUp.length} volunteers: TODO 2</Text>
    </View>
  );
}
