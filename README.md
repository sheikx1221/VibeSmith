## Node Modules Errors
If you receive any of the following errors, just use the solution given and the error will be solved

### Error while updating property 'stroke' in shadow node of type: ARTShape
Solution: -
Make sure the version of @react-native-community/art is 1.1.2
Make sure the version of react-native-progress is 4.1.2
Go to file node_modules@react-native-community\art\lib\Shape.js
Change the 64th line stroke={extractColor(props.stroke)} with stroke={extractBrush(props.stroke)}
