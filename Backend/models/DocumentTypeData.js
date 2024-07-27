import { DataTypes } from "sequelize";
import sequelize from "../utils/db.js";

const DocumentTypeData = sequelize.define("DocumentTypeData", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
});

export default DocumentTypeData;
