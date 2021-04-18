import React, { useState, useEffect } from "react";
import axios from "axios";
import { IThemeData } from "../../data/ThemeData";
import { webAPIUrl } from "../../AppSettings";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

export default function ThemesMenu() {
  const [data, setData] = useState<IThemeData[]>([]);
  useEffect(() => {
    axios
      .get<IThemeData[]>(webAPIUrl + "/themes", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setData(response.data);
      })
      .catch((ex) => {
        console.log(ex);
      });
  }, []);

  return (
    <div>
      {data.map((theme) => (
        <Button
          component={Link}
          to={"/themes/" + theme.id}
          color="inherit"
          key={theme.id}
          endIcon={<ArrowDropDownIcon/>}
        >
          {theme.name}
        </Button>
      ))}
    </div>
  );
}
