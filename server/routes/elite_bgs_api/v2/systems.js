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

const express = require('express');
const passport = require('passport');
const _ = require('lodash');

let router = express.Router();

/**
   * @swagger
   * /systems:
   *   get:
   *     description: Get the Systems
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: ID of the document.
   *         in: query
   *         type: string
   *       - name: name
   *         description: System name.
   *         in: query
   *         type: string
   *       - name: allegiance
   *         description: Name of the allegiance.
   *         in: query
   *         type: string
   *       - name: government
   *         description: Name of the government type.
   *         in: query
   *         type: string
   *       - name: state
   *         description: State the system is in.
   *         in: query
   *         type: string
   *       - name: primaryeconomy
   *         description: The primary economy of the system.
   *         in: query
   *         type: string
   *       - name: power
   *         description: Comma seperated names of powers in influence in the system.
   *         in: query
   *         type: string
   *       - name: powerstate
   *         description: Comma seperated states of the powers in influence in the system.
   *         in: query
   *         type: string
   *       - name: security
   *         description: The name of the security status in the system.
   *         in: query
   *         type: string
   *       - name: beginswith
   *         description: Starting characters of the system.
   *         in: query
   *         type: string
   *       - name: page
   *         description: Page no of response.
   *         in: query
   *         type: integer
   *     responses:
   *       200:
   *         description: An array of systems with historical data
   *         schema:
   *           type: array
   *           items:
   *             $ref: '#/definitions/EBGSSystemsPage'
   *     deprecated: true
   */
router.get('/', passport.authenticate('basic', { session: false }), (req, res, next) => {
    require('../../../models/ebgs_systems')
        .then(systems => {
            let query = new Object;
            let page = 1;

            if (req.query.id) {
                query._id = req.query.id;
            }
            if (req.query.name) {
                query.name_lower = req.query.name.toLowerCase();
            }
            if (req.query.allegiance) {
                query.allegiance = req.query.allegiance.toLowerCase();
            }
            if (req.query.government) {
                query.government = req.query.government.toLowerCase();
            }
            if (req.query.state) {
                query.state = req.query.state.toLowerCase();
            }
            if (req.query.primaryeconomy) {
                query.primary_economy = req.query.primaryeconomy.toLowerCase();
            }
            if (req.query.power) {
                let powers = arrayfy(req.query.power);
                query.power = { $in: powers };
            }
            if (req.query.powerstate) {
                let powerStates = arrayfy(req.query.powerstate);
                query.power_state = { $in: powerStates };
            }
            if (req.query.security) {
                query.security = req.query.security.toLowerCase();
            }
            if (req.query.beginsWith) {
                query.name_lower = {
                    $regex: new RegExp(`^${req.query.beginsWith.toLowerCase()}`)
                }
            }
            if (_.isEmpty(query) && req.user.clearance !== 0) {
                throw new Error("Add at least 1 query parameter to limit traffic");
            }
            if (req.query.page) {
                page = req.query.page;
            }
            let paginateOptions = {
                lean: true,
                page: page,
                limit: 10
            };
            systems.paginate(query, paginateOptions)
                .then(result => {
                    res.status(200).json(result);
                })
                .catch(next)
        })
        .catch(next);
});

let arrayfy = requestParam => {
    let regex = /\s*,\s*/;
    let mainArray = requestParam.split(regex);

    mainArray.forEach((element, index, allElements) => {
        allElements[index] = element.toLowerCase();
    }, this);

    return mainArray;
}

module.exports = router;
