import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { Modalize } from "react-native-modalize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

import { themas } from "../global/themes";
import { Flag } from "../components/Flag";
import { Input } from "../components/Input";
import { Loading } from "../components/Loading";
import CustomDateTimePicker from "../components/CustomDateTimePicker";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/* ===================== TIPOS ===================== */
export type FlagType = "baixa" | "media" | "alta";

export interface Task {
  item: number;
  title: string;
  description: string;
  flag: FlagType;
  timeLimit: string;
}

interface AuthContextListType {
  onOpen: () => void;
  taskList: Task[];
  handleDelete: (task: Task) => void;
  handleEdit: (task: Task) => void;
  filter: (text: string) => void;
}

const FLAGS = {
  alta: themas.Colors.red,
  media: themas.Colors.yellow,
  baixa: themas.Colors.blueLigth,
};

export const AuthContextList = createContext<AuthContextListType | null>(null);

export const AuthProviderList = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const modalizeRef = useRef<Modalize>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFlag, setSelectedFlag] = useState<FlagType>("baixa");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [taskListBackup, setTaskListBackup] = useState<Task[]>([]);
  const [item, setItem] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ title: false });

  /* ===================== RESET ===================== */
  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setSelectedFlag("baixa");
    setItem(0);
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setErrors({ title: false });
  }, []);

  /* ===================== ACTIONS ===================== */
  const onOpen = () => {
    resetForm();
    modalizeRef.current?.open();
  };

  const handleEdit = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setSelectedFlag(task.flag);
    setItem(task.item);
    const date = new Date(task.timeLimit);
    setSelectedDate(date);
    setSelectedTime(date);
    setErrors({ title: false });
    modalizeRef.current?.open();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setErrors({ title: true });
      return;
    }

    const newTask: Task = {
      item: item !== 0 ? item : Date.now(),
      title: title.trim(),
      description,
      flag: selectedFlag,
      timeLimit: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
      ).toISOString(),
    };

    // 1. FECHA O MODAL PRIMEIRO para garantir que ele não suma por causa do re-render
    modalizeRef.current?.close();

    // 2. Aguarda a animação de fechar para processar os dados
    setTimeout(async () => {
      setLoading(true);
      try {
        const list = [...taskListBackup];
        const index = list.findIndex((t) => t.item === newTask.item);
        index >= 0 ? (list[index] = newTask) : list.push(newTask);

        await AsyncStorage.setItem("taskList", JSON.stringify(list));
        setTaskList(list);
        setTaskListBackup(list);
        resetForm();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleDelete = async (task: Task) => {
    setLoading(true);
    try {
      const updated = taskListBackup.filter((t) => t.item !== task.item);
      await AsyncStorage.setItem("taskList", JSON.stringify(updated));
      setTaskList(updated);
      setTaskListBackup(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filter = (text: string) => {
    const search = text.trim().toLowerCase();
    if (!search) {
      setTaskList(taskListBackup);
      return;
    }
    setTaskList(
      taskListBackup.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search),
      ),
    );
  };

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("taskList");
      if (stored) {
        const parsed = JSON.parse(stored);
        setTaskList(parsed);
        setTaskListBackup(parsed);
      }
    })();
  }, []);

  return (
    <AuthContextList.Provider
      value={{ onOpen, taskList, handleEdit, handleDelete, filter }}
    >
      <Loading loading={loading} />
      {children}

      <Modalize
        ref={modalizeRef}
        // SOLUÇÃO PARA NÃO SUMIR: Altura fixa em vez de automática
        modalHeight={SCREEN_HEIGHT * 0.85}
        snapPoint={SCREEN_HEIGHT * 0.85}
        tapGestureEnabled={false}
        keyboardAvoidingBehavior={Platform.OS === "ios" ? "padding" : "height"}
        handlePosition="inside"
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => modalizeRef.current?.close()}>
                <MaterialIcons name="close" size={30} />
              </TouchableOpacity>
              <Text style={styles.title}>
                {item ? "Editar tarefa" : "Criar tarefa"}
              </Text>
              <TouchableOpacity onPress={handleSave}>
                <AntDesign name="check" size={30} />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Input
                title="Título:"
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (errors.title) setErrors({ title: false });
                }}
                required
                error={errors.title}
              />
              <Input
                title="Descrição:"
                height={100}
                multiline
                value={description}
                onChangeText={setDescription}
              />

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Input
                    title="Data limite:"
                    editable={false}
                    value={selectedDate.toLocaleDateString()}
                    onPress={() => setShowDatePicker(true)}
                  />
                </View>
                <View style={{ width: 110 }}>
                  <Input
                    title="Hora limite:"
                    editable={false}
                    value={selectedTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    onPress={() => setShowTimePicker(true)}
                  />
                </View>
              </View>

              <CustomDateTimePicker
                type="date"
                show={showDatePicker}
                setShow={setShowDatePicker}
                onDateChange={setSelectedDate}
              />
              <CustomDateTimePicker
                type="time"
                show={showTimePicker}
                setShow={setShowTimePicker}
                onDateChange={setSelectedTime}
              />

              <Text style={styles.flag}>Prioridade:</Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  marginTop: 10,
                  paddingBottom: 50,
                }}
              >
                {Object.entries(FLAGS).map(([key, color]) => (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setSelectedFlag(key as FlagType)}
                  >
                    <Flag
                      caption={key}
                      color={color}
                      selected={selectedFlag === key}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modalize>
    </AuthContextList.Provider>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  content: { padding: 20 },
  flag: { marginTop: 20, fontWeight: "bold" },
});

export const useAuth = () => {
  const context = useContext(AuthContextList);
  if (!context) throw new Error("useAuth must be used within AuthProviderList");
  return context;
};
