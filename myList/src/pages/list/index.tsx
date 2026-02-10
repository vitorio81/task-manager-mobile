import React, { useContext, useRef } from "react";
import {
  Text,
  View,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import type { Swipeable as SwipeableType } from "react-native-gesture-handler";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

import { style } from "./styles";
import { Ball } from "../../components/Ball";
import { Input } from "../../components/Input";
import { Flag } from "../../components/Flag";
import { themas } from "../../global/themes";
import { formatDateToBR } from "../../global/funtions";

import { Task, FlagType } from "../../@types/task";
import { AuthContextList } from "../../context/authContext_list";

/* ===================== CONFIG FLAG ===================== */

const flagConfig: Record<FlagType, { label: string; color: string }> = {
  baixa: {
    label: "baixa",
    color: themas.Colors.blueLigth,
  },
  media: {
    label: "media",
    color: themas.Colors.yellow,
  },
  alta: {
    label: "alta",
    color: themas.Colors.red,
  },
};

/* ===================== COMPONENT ===================== */

export default function List() {
  const context = useContext(AuthContextList);

  if (!context) {
    throw new Error("List must be used within AuthContextListProvider");
  }

  const { taskList, handleDelete, handleEdit, filter } = context;

  // Refs para controlar o fechamento manual do swipe após o clique
  const swipeableRefs = useRef<(SwipeableType | null)[]>([]);

  /* BOTÃO DE EXCLUIR (Lado Direito)
   */
  const renderRightActions = (task: Task, index: number) => (
    <TouchableOpacity
      style={[
        style.Button,
        {
          backgroundColor: themas.Colors.red,
          width: 80,
          height: "100%",
          borderRadius: 10,
        },
      ]}
      onPress={() => {
        handleDelete(task);
        swipeableRefs.current[index]?.close();
      }}
    >
      <AntDesign name="delete" size={20} color="#FFF" />
      <Text style={{ color: "#FFF", fontSize: 12, marginTop: 4 }}>Excluir</Text>
    </TouchableOpacity>
  );

  /* BOTÃO DE EDITAR (Lado Esquerdo)
   */
  const renderLeftActions = (task: Task, index: number) => (
    <TouchableOpacity
      style={[
        style.Button,
        {
          backgroundColor: themas.Colors.blueLigth,
          width: 80,
          height: "100%",
          borderRadius: 10,
        },
      ]}
      onPress={() => {
        handleEdit(task);
        swipeableRefs.current[index]?.close();
      }}
    >
      <AntDesign name="edit" size={20} color="#FFF" />
      <Text style={{ color: "#FFF", fontSize: 12, marginTop: 4 }}>Editar</Text>
    </TouchableOpacity>
  );

  const renderCard = (task: Task, index: number) => {
    const { color, label } = flagConfig[task.flag];

    return (
      <Swipeable
        ref={(ref) => {
          swipeableRefs.current[index] = ref;
        }}
        // Configuração dos botões
        renderRightActions={() => renderRightActions(task, index)}
        renderLeftActions={() => renderLeftActions(task, index)}
        // Impede que o swipe arraste infinitamente além dos botões
        overshootRight={false}
        overshootLeft={false}
      >
        <View style={style.card}>
          <View style={style.rowCard}>
            <View style={style.rowCardLeft}>
              <Ball color={color} />

              <View>
                <Text style={style.titleCard}>{task.title}</Text>
                <Text style={style.descriptionCard}>{task.description}</Text>
                <Text style={style.descriptionCard}>
                  até {formatDateToBR(task.timeLimit)}
                </Text>
              </View>
            </View>

            <Flag caption={label} color={color} />
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={style.container}>
      <StatusBar barStyle="light-content" />

      <View style={style.header}>
        <Text style={style.greeting}>
          Bom dia, <Text style={{ fontWeight: "bold" }}>Caio E.</Text>
        </Text>

        <View style={style.boxInput}>
          <Input
            IconLeft={MaterialIcons}
            iconLeftName="search"
            onChangeText={filter}
            placeholder="Pesquisar tarefa..."
          />
        </View>
      </View>

      <View style={style.boxList}>
        <FlatList
          data={taskList}
          keyExtractor={(item) => item.item.toString()}
          renderItem={({ item, index }) => renderCard(item, index)}
          contentContainerStyle={{
            paddingHorizontal: 30,
            paddingTop: 40,
            paddingBottom: 100,
          }}
          // Melhora a performance da lista
          removeClippedSubviews={false}
        />
      </View>
    </View>
  );
}
