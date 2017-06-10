/*
 * KodeBlox Copyright 2017 Sayak Mukhopadhyay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http: //www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

const stationsModel = require('../../models/stations');

module.exports.import = () => {
    return new Promise((resolve, reject) => {
        stationsModel.then(model => {
            model.insertMany(require('../../dumps/stations.json'))
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    })
}