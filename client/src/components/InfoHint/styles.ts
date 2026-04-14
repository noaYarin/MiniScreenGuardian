import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
    },

    iconButton: {
        width: 34,
        height: 34,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#EFF6FF",
        borderWidth: 1,
        borderColor: "#DBEAFE",
    },

    iconButtonPressed: {
        opacity: 0.8,
    },

    card: {
        marginTop: 10,
        borderRadius: 14,
        padding: 12,
        backgroundColor: "#F8FAFF",
        borderWidth: 1,
        borderColor: "#D6E6FF",
        gap: 8,
    },

    title: {
        fontSize: 14,
        color: "#1E3A8A",
        textAlign: "center",
        alignSelf: "center",
    },
    
    titleSeparator: {
        marginTop: 8,
        marginBottom: 2,
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },

    linesWrap: {
        gap: 8,
    },

    lineRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 999,
        marginTop: 7,
        backgroundColor: "#2563EB",
    },

    lineText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 19,
        color: "#334155",
    },
    triggerButton: {
        alignSelf: "flex-start",
        minHeight: 34,
        borderRadius: 999,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "#EFF6FF",
        borderWidth: 1,
        borderColor: "#DBEAFE",
    },

    triggerButtonText: {
        fontSize: 13,
        color: "#2563EB",
    },
    separator: {
        marginTop: 8,
        marginLeft: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#E2E8F0",
    },
    lineItemLtr: {
        direction: "ltr",
        width: "100%",
    },
});