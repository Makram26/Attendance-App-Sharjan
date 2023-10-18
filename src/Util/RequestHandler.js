import { AsyncStorage } from '@react-native-async-storage/async-storage';

import db from '../Database';
import { CheckInAPI, CheckOutAPI } from '../services';
const RequestHandler = {
    // this function run when arrive internet 
    async retryFailedRequests() {
        try {
            let tempdata = []
            db.executeSql(
                'SELECT * FROM users',
                [],
                (async (resultSet) => {
                    const rows = resultSet.rows;
                    tempdata.push(...rows.raw())
                    for (var i = 0; i < tempdata.length; i++) {
                        if (tempdata[i].type == "Clock In") {
                            try {
                                const response = await CheckInAPI(tempdata[i].time, tempdata[i].image, tempdata[i].latitude, tempdata[i].longitude, tempdata[i].userid)
                                if (response.result.message == "Checked in successfully.") {
                                    try {
                                        db.executeSql(
                                            'DELETE FROM users WHERE id = ?',
                                            [tempdata[i].id], // replace 5 with the actual ID of the row you want to delete
                                            () => console.log("Record Delete Successfully!"),
                                            error => console.error('Error deleting data', error)
                                        );
                                        // setLoading(false)
                                    } catch (error) {
                                        console.log("error", error)
                                        // setLoading(false)
                                    }
                                }
                                else {
                                    db.executeSql(
                                        'UPDATE users SET failure = ? WHERE id = ?',
                                        [response.result.message, tempdata[i].id],
                                        () => { console.log('Auto Failure message updated!') },
                                        error => console.error('Error updating data', error)
                                    );

                                }
                            } catch (error) {
                                console.log("error", error)
                                db.executeSql(
                                    'UPDATE users SET failure = ? WHERE id = ?',
                                    [`${error}`, tempdata[i].id],
                                    () => { console.log('Auto Failure message updated when internet gone!') },
                                    error => console.error('Error updating data', error)
                                );
                            }

                        }
                        else {
                            try {
                                const response = await CheckOutAPI(tempdata[i].time, tempdata[i].image, tempdata[i].latitude, tempdata[i].longitude, tempdata[i].userid)
                                if (response.result.message == "Checked out successfully.") {
                                    try {
                                        db.executeSql(
                                            'DELETE FROM users WHERE id = ?',
                                            [tempdata[i].id],
                                            () => console.log("Record Delete Successfully!"),
                                            error => console.error('Error deleting data', error)
                                        );
                                    } catch (error) {
                                        console.log("error", error)
                                    }
                                }
                                else {
                                    db.executeSql(
                                        'UPDATE users SET failure = ? WHERE id = ?',
                                        [response.result.message, tempdata[i].id],
                                        () => { console.log('Auto Failure message updated!') },
                                        error => console.error('Error updating data', error)
                                    );

                                }
                            } catch (error) {
                                console.log("error", error)
                                db.executeSql(
                                    'UPDATE users SET failure = ? WHERE id = ?',
                                    [`${error}`, tempdata[i].id],
                                    () => { console.log('Auto Failure message updated when internet gone!') },
                                    error => console.error('Error updating data', error)
                                );
                            }

                        }
                    }
                }),
                error => console.error('Error selecting data', error)
            )
        } catch (error) {
            console.error('Error while retrying failed requests:', error);
        }
    },
};
export default RequestHandler;