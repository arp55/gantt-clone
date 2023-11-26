import { TextField, TextFieldProps } from "@mui/material";
import React from "react";
import { styled } from "@mui/material/styles";
//   import "./Common.scss";

interface CustomType {
  themeType?: {
    borderDark?: string | null;
    borderLight?: string | null;
    bgDark?: string | null;
    bgLight?: string | null;
  };
  preText?: boolean;
}

type Props = CustomType & TextFieldProps;

const CssTextField: any = styled(TextField)((props: any) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor:
        props.themeName === "dark" && props.themeType?.borderDark
          ? props.themeType?.borderDark
          : "#DBE2F0",
      borderWidth:
        props.themeName === "dark" && props.themeType?.borderDark === null
          ? "0"
          : "1px",
    },
    "&:hover fieldset": {
      borderColor: props.disabled ? "none" : "#1976d2",
    },
    //   '&.Mui-focused fieldset': {
    //     borderColor: 'green',
    //   },
  },
}));

export default function CustomInput(props: Props) {
  return (
    <CssTextField
      fullWidth
      variant="outlined"
      size="small"
      //   themeName={theme}
      sx={{
        borderRadius: "4px",
        background: "auto",
      }}
      inputProps={{
        style: {
          padding: "12px 15px",
          color: "#0b0c0e",
        },
      }}
      {...props}
    />
  );
}
