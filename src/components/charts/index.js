import React from "react";
import CustomLineChart from "./chartTypes/CustomLineChart";
import CustomBarChart from "./chartTypes/CustomBarChart";
import CustomAreaChart from "./chartTypes/CustomAreaChart";
import CustomPieChart from "./chartTypes/CustomPieChart";


export const generateColor = () => {
    const colorsArray = ["#8884d8", "#82ca9d", '#0088FE', '#00C49F', '#FFBB28', '#FF8042', "#3498db", "#e74c3c", "#2ecc71", "#f39c12"];
    const randomIndex = Math.floor(Math.random() * colorsArray.length);
    return colorsArray[randomIndex];
};


export class LineChartCustom {
    constructor(comparing_columns, comparing_by) {
        this._comparing_columns = comparing_columns;
        this._comparing_by = comparing_by;
    }

    get comparing_columns() {
        return this._comparing_columns;
    }

    set comparing_columns(value) {
        this._comparing_columns = value;
    }

    get comparing_by() {
        return this._comparing_by;
    }

    set comparing_by(value) {
        this._comparing_by = value;
    }

    draw() {
        return <CustomLineChart comparing_columns={this.comparing_columns} comparing_by={this.comparing_by} />;
    }
}

export class BarChartCustom {
    constructor(comparing_columns, comparing_by) {
        this._comparing_columns = comparing_columns;
        this._comparing_by = comparing_by;
    }

    get comparing_columns() {
        return this._comparing_columns;
    }

    set comparing_columns(value) {
        this._comparing_columns = value;
    }

    get comparing_by() {
        return this._comparing_by;
    }

    set comparing_by(value) {
        this._comparing_by = value;
    }

    draw() {
        return <CustomBarChart comparing_columns={this.comparing_columns} comparing_by={this.comparing_by} />;
    }
}

export class AreaChartCustom {
    constructor(comparing_columns, comparing_by) {
        this._comparing_columns = comparing_columns;
        this._comparing_by = comparing_by;
    }

    get comparing_columns() {
        return this._comparing_columns;
    }

    set comparing_columns(value) {
        this._comparing_columns = value;
    }

    get comparing_by() {
        return this._comparing_by;
    }

    set comparing_by(value) {
        this._comparing_by = value;
    }

    draw() {
        return <CustomAreaChart comparing_columns={this.comparing_columns} comparing_by={this.comparing_by} />;
    }
}

export class PieChartCustom {
    constructor(comparing_columns, comparing_by) {
        this._comparing_columns = comparing_columns;
        this._comparing_by = comparing_by;
    }

    get comparing_columns() {
        return this._comparing_columns;
    }

    set comparing_columns(value) {
        this._comparing_columns = value;
    }

    get comparing_by() {
        return this._comparing_by;
    }

    set comparing_by(value) {
        this._comparing_by = value;
    }

    draw() {
        return <CustomPieChart comparing_columns={this.comparing_columns} comparing_by={this.comparing_by} />;
    }
}
