const MotionData = [
    // {    
    //     Name:"Acceleration",
    //     Definition:"Device acceleration on the three axis as an object with x, y, z keys. Expressed in m/s2."
    // },
    // {
    //     Name:"Acceleration with Gravity",
    //     Definition:"Device acceleration with the effect of gravity on the three axis as an object with x, y, z keys. Expressed in m/s2."
    // },
    {
        Name:"Rotation",
        Definition:"Device's orientation in space as an object with alpha, beta, gamma keys where alpha is for rotation around Z axis, beta for X axis rotation and gamma for Y axis rotation.",
        Image:require("../../../assets/sensors/orientation.png")
    },
    {
        Name:"Rotation Rate",
        Definition:"Device's rate of rotation in space expressed in degrees per second (deg/s)."
    },
    {
        Name:"Orientation",
        Definition:"Device orientation based on screen rotation. Value is on of 0 (portrait), 90 (right landscape), 180 (upside down), -90 (left landscape).",
        Image:require("../../../assets/sensors/deviceMotion.png")
    }
];

export default MotionData;