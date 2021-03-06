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

module.exports = new Promise((resolve, reject) => {
    let db = require('../db');
    let connection = db.elite_bgs;
    let mongoose = db.mongoose;
    let Schema = mongoose.Schema;
    let ObjectId = mongoose.Schema.Types.ObjectId;

    let ebgsHistorySystem = new Schema({
        system_id: { type: ObjectId, index: true },
        system_name_lower: { type: String, lowercase: true },
        updated_at: { type: Date, index: true },
        updated_by: String,
        population: Number,
        government: { type: String, lowercase: true },
        allegiance: { type: String, lowercase: true },
        state: { type: String, lowercase: true },
        security: { type: String, lowercase: true },
        controlling_minor_faction: { type: String, lowercase: true },
        factions: [{
            _id: false,
            name: String,
            name_lower: { type: String, lowercase: true }
        }]
    }, { runSettersOnQuery: true });

    let model = connection.model('ebgsHistorySystemV4', ebgsHistorySystem);

    resolve(model);
})
