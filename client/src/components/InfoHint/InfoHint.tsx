import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../AppText/AppText";
import { styles } from "./styles";

type InfoHintProps = {
    title?: string;
    lines: string[];
};

export default function InfoHint({
    title = "Important information",
    lines,
}: InfoHintProps) {
    const [open, setOpen] = useState(false);

    return (
        <View style={styles.wrapper}>
            <Pressable
                onPress={() => setOpen((prev) => !prev)}
                accessibilityRole="button"
                accessibilityLabel={open ? "Hide information" : "Show information"}
                style={({ pressed }) => [
                    styles.triggerButton,
                    pressed ? styles.iconButtonPressed : null,
                ]}
            >
                <MaterialCommunityIcons
                    name={open ? "information" : "information-outline"}
                    size={18}
                    color="#2563EB"
                />

                <AppText weight="bold" style={styles.triggerButtonText}>
                    Info
                </AppText>
            </Pressable>

            {open ? (
                <View style={styles.card}>
                    <AppText weight="bold" style={styles.title}>
                        {title}
                    </AppText>

                    <View style={styles.titleSeparator} />


                    <View style={styles.linesWrap}>
                        {lines.map((line, index) => (
                            <View key={`${title}-${index}`} style={styles.lineItemLtr}>
                                <View style={styles.lineRow}>
                                    <View style={styles.dot} />
                                    <AppText style={styles.lineText}>{line}</AppText>
                                </View>

                                {index < lines.length - 1 ? <View style={styles.separator} /> : null}
                            </View>
                        ))}
                    </View>
                </View>
            ) : null}
        </View>
    );
}

