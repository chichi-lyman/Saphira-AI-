export const initiateBluetoothConnection = async () => {
  const customNavigator = navigator as any;
  if (!customNavigator.bluetooth) {
    console.warn("Web Bluetooth API not supported in this browser.");
    return null;
  }

  try {
    const device = await customNavigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['generic_access'] // Example subset
    });
    
    console.log("Connected to hardware device:", device.name);
    return device;
  } catch (error) {
    console.error("Bluetooth connection failed:", error);
    return null;
  }
};
