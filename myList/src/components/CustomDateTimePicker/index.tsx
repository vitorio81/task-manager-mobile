// CustomDateTimePicker.tsx
import React from "react";
import { View, Modal, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { style } from "./styles";

interface CustomDateTimePickerProps {
  type: "date" | "time" | "datetime";
  onDateChange: (date: Date) => void;
  show: boolean;
  setShow: (show: boolean) => void;
}

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  type,
  onDateChange,
  show,
  setShow,
}) => {
  if (!show) return null;

  // Criamos uma variável para a data atual
  const today = new Date();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={show}
      onRequestClose={() => setShow(false)}
    >
      <View style={style.modalOverlay}>
        <View style={[style.container, { backgroundColor: "#FFFFFF" }]}>
          <DateTimePicker
            value={new Date()} // Data inicial exibida no calendário
            // ✅ ESTA LINHA É A CHAVE:
            minimumDate={today}
            mode={type === "datetime" ? "date" : type}
            is24Hour={true}
            display={Platform.OS === "ios" ? "inline" : "default"}
            textColor="#000000"
            themeVariant="light"
            onChange={(event, selectedDate) => {
              if (event.type === "dismissed") {
                setShow(false);
                return;
              }

              if (selectedDate) {
                setShow(false);
                onDateChange(selectedDate);
              } else {
                setShow(false);
              }
            }}
          />
        </View>
      </View>
    </Modal>
  );
};
export default CustomDateTimePicker;
