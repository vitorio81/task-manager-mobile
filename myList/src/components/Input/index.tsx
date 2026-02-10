import React, { forwardRef, LegacyRef, useEffect, useState } from "react";
import {
  TextInput,
  View,
  TextInputProps,
  Text,
  TouchableOpacity,
  StyleProp,
  TextStyle,
} from "react-native";
import { MaterialIcons, FontAwesome, Octicons } from "@expo/vector-icons";
import { themas } from "../../global/themes";
import { style } from "./styles";

type IconComponent =
  | React.ComponentType<React.ComponentProps<typeof MaterialIcons>>
  | React.ComponentType<React.ComponentProps<typeof FontAwesome>>
  | React.ComponentType<React.ComponentProps<typeof Octicons>>;

type Props = TextInputProps & {
  IconLeft?: IconComponent;
  IconRigth?: IconComponent;
  iconLeftName?: string;
  iconRightName?: string;
  title?: string;
  required?: boolean;
  error?: boolean; // Recebe o erro externo do Context/Form
  onIconLeftPress?: () => void;
  onIconRigthPress?: () => void;
  height?: number;
  labelStyle?: StyleProp<TextStyle>;
};

export const Input = forwardRef(
  (props: Props, ref: LegacyRef<TextInput> | null) => {
    const {
      IconLeft,
      IconRigth,
      iconLeftName,
      iconRightName,
      title,
      onIconLeftPress,
      onIconRigthPress,
      height,
      labelStyle,
      required,
      error,
      value,
      onChangeText,
      ...rest
    } = props;

    // Erro local para quando o usuário sai do campo (Blur)
    const [localError, setLocalError] = useState(false);

    // Determina se deve mostrar a cor de erro (combina erro interno e externo)
    const hasError = localError || error;

    /** 🔹 Ajusta largura do input conforme ícones */
    const calculateSizeWidth = () => {
      if (IconLeft && IconRigth) return "80%";
      if (IconLeft || IconRigth) return "90%";
      return "100%";
    };

    /** 🔹 Ajusta padding conforme ícones */
    const calculateSizePaddingLeft = () => {
      if (IconLeft && IconRigth) return 0;
      if (IconLeft || IconRigth) return 10;
      return 20;
    };

    /** 🔹 Remove erro local automaticamente ao digitar */
    useEffect(() => {
      if (value?.toString().trim()) {
        setLocalError(false);
      }
    }, [value]);

    return (
      <View style={{ marginBottom: 15 }}>
        {/* LABEL */}
        {title && (
          <Text style={[style.titleInput, labelStyle]}>
            {title}
            {required && <Text style={{ color: "red" }}> *</Text>}
          </Text>
        )}

        {/* INPUT CONTAINER */}
        <View
          style={[
            style.boxInput,
            {
              paddingLeft: calculateSizePaddingLeft(),
              height: height ? height : 40,
              padding: 5,
              borderWidth: 1,
              borderColor: hasError ? "red" : themas.Colors.gray,
            },
          ]}
        >
          {IconLeft && iconLeftName && (
            <TouchableOpacity onPress={onIconLeftPress} style={style.Button}>
              <IconLeft
                name={iconLeftName as any}
                size={20}
                color={hasError ? "red" : themas.Colors.gray}
                style={style.Icon}
              />
            </TouchableOpacity>
          )}

          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            style={[
              style.input,
              { width: calculateSizeWidth(), height: "100%" },
            ]}
            onBlur={() => {
              // Ativa erro local se o campo for obrigatório e estiver vazio
              if (required && !value?.toString().trim()) {
                setLocalError(true);
              }
            }}
            {...rest}
          />

          {IconRigth && iconRightName && (
            <TouchableOpacity onPress={onIconRigthPress} style={style.Button}>
              <IconRigth
                name={iconRightName as any}
                size={20}
                color={hasError ? "red" : themas.Colors.gray}
                style={style.Icon}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* MENSAGEM DE ERRO (Só aparece se houver erro) */}
        {hasError && (
          <Text
            style={{ color: "red", fontSize: 12, marginTop: 2, marginLeft: 5 }}
          >
            Campo obrigatório
          </Text>
        )}
      </View>
    );
  },
);
