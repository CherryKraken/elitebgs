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

let mongoosePaginate = require('mongoose-paginate');

module.exports = new Promise((resolve, reject) => {
    let db = require('../db');
    let connection = db.elite_bgs;
    let mongoose = db.mongoose;
    let Schema = mongoose.Schema;

    let ebgsFaction = new Schema({
        eddb_id: Number,
        name: String,
        name_lower: { type: String, lowercase: true, index: true },
        updated_at: Date,
        government: { type: String, lowercase: true, index: true },
        allegiance: { type: String, lowercase: true, index: true },
        home_system_name: { type: String, lowercase: true },    // Not in Journal
        is_player_faction: Boolean,     // Not in Journal
        faction_presence: [{
            _id: false,
            system_name: String,
            system_name_lower: { type: String, lowercase: true },
            state: { type: String, lowercase: true },
            influence: Number,
            pending_states: [{
                _id: false,
                state: { type: String, lowercase: true },
                trend: Number
            }],
            recovering_states: [{
                _id: false,
                state: { type: String, lowercase: true },
                trend: Number
            }]
        }]
    }, { runSettersOnQuery: true });

    ebgsFaction.plugin(mongoosePaginate);

    let model = connection.model('ebgsFactionV4', ebgsFaction);

    resolve(model);
})
