// Jest only (do not edit). Jest uses this file instead of AsyncStorage, because a test has no phone: the package's
// own test version, which keeps the values in memory with the same methods (getItem, setItem, removeItem, clear).
export { default } from '@react-native-async-storage/async-storage/jest/async-storage-mock';
