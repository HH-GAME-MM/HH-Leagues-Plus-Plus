// ==UserScript==
// @name         HH Leagues++ (Dev Version)
// @version      0.16.4
// @description  Upgrade League with various features
// @author       -MM-
// @match        https://*.hentaiheroes.com/leagues.html*
// @match        https://*.hentaiheroes.com/home.html*
// @match        https://*.hentaiheroes.com/leagues-pre-battle.html*
// @match        https://nutaku.haremheroes.com/leagues.html*
// @match        https://nutaku.haremheroes.com/home.html*
// @match        https://nutaku.haremheroes.com/leagues-pre-battle.html*
// @match        https://*.comixharem.com/leagues.html*
// @match        https://*.comixharem.com/home.html*
// @match        https://*.comixharem.com/leagues-pre-battle.html*
// @match        https://*.pornstarharem.com/leagues.html*
// @match        https://*.pornstarharem.com/home.html*
// @match        https://*.pornstarharem.com/leagues-pre-battle.html*
// @match        https://*.gayharem.com/leagues.html*
// @match        https://*.gayharem.com/home.html*
// @match        https://*.gayharem.com/leagues-pre-battle.html*
// @match        https://*.gaypornstarharem.com/leagues.html*
// @match        https://*.gaypornstarharem.com/home.html*
// @match        https://*.gaypornstarharem.com/leagues-pre-battle.html*
// @match        https://*.transpornstarharem.com/leagues.html*
// @match        https://*.transpornstarharem.com/home.html*
// @match        https://*.transpornstarharem.com/leagues-pre-battle.html*
// @match        https://*.hornyheroes.com/leagues.html*
// @match        https://*.hornyheroes.com/home.html*
// @match        https://*.hornyheroes.com/leagues-pre-battle.html*
// @run-at       document-end
// @namespace    https://github.com/HH-GAME-MM/HH-Leagues-Plus-Plus
// @updateURL    https://github.com/HH-GAME-MM/HH-Leagues-Plus-Plus/raw/main/HH-Leagues-Plus-Plus.user.js
// @downloadURL  https://github.com/HH-GAME-MM/HH-Leagues-Plus-Plus/raw/main/HH-Leagues-Plus-Plus.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentaiheroes.com
// @grant        GM_info
// @grant        unsafeWindow
// ==/UserScript==

//CHANGELOG: https://github.com/HH-GAME-MM/HH-Leagues-Plus-Plus/raw/main/CHANGELOG.md

(async function(window) {
    //definitions
    'use strict';
    /*global shared,opponents_list,$*/

    console.log(GM_info.script.name + ' Script v' + GM_info.script.version);

    //shared game functions and objects
    const Hero = (window.Hero ? window.Hero : shared.Hero);
    const hh_ajax = (window.hh_ajax ? window.hh_ajax : shared.general.hh_ajax);
    const ajaxBattle = (window.ajaxBattle ? window.ajaxBattle : shared.general.ajaxBattle);
    const loadingAnimation = (window.loadingAnimation ? window.loadingAnimation : shared.animations.loadingAnimation);
    const HHPopupManager = (window.HHPopupManager ? window.HHPopupManager : shared.popups_manager.HHPopupManager);
    const objectivePopup = (window.objectivePopup ? window.objectivePopup : shared.general.objectivePopup);
    const hero_page_popup = (window.hero_page_popup ? window.hero_page_popup : shared.general.hero_page_popup);
    const Reward = (window.Reward ? window.Reward : shared.reward_popup.Reward);
    const buildPlayerBlock = (window.buildPlayerBlock ? window.buildPlayerBlock : shared.team_block_builder.buildPlayerBlock);
    const hc_confirm = (window.hc_confirm ? window.hc_confirm : shared.general.hc_confirm);
    const getSessionId = (window.getSessionId ? window.getSessionId : () => { return new URLSearchParams(window.location.search).get("sess"); }); //Nutaku only

    const config = await loadConfig();
    if(window.location.pathname === '/leagues.html') {
        Leagues_css();
        setTimeout(Leagues_run, 1);
    } else if(window.location.pathname === '/leagues-pre-battle.html') {
        LeaguesPreBattle_css();
    }

    function Leagues_css()
    {
        let css = document.createElement('style');
        document.head.appendChild(css);

        if(!config.ChallengeX3ButtonEnabled)
        {
            css.sheet.insertRule('#leagues .league_opponent .player-panel-buttons .league-multiple-battle-button { display:none !important; }');
            css.sheet.insertRule('#leagues .league_opponent .player-panel-buttons .league-single-battle-button { width: 75% }');
        }

        css.sheet.insertRule('#leagues .league_content .league_buttons .league_buttons_block .multiple-battles { min-width: 6.7rem; min-height: 54px; margin-right: 10px; }');
        css.sheet.insertRule('#leagues .league_content .league_buttons .change_team_container #change_team { min-width: 6.7rem; height: 54px; }');
        css.sheet.insertRule('#leagues .league_content .league_buttons .change_team_container #change_team div { height: 100%; display: flex; justify-content: center; align-items: center; }');
        css.sheet.insertRule('#leagues .league_content .league_buttons .league_end_in div p { max-width: 6.5rem; line-height: 1; }');
        css.sheet.insertRule('#leagues .league_content .league_table .data-list .data-row .data-column[column="team"] { column-gap: 3px; }');
        css.sheet.insertRule('#leagues .league_content .league_table .data-list .data-row .data-column[column="team"] .team-theme.icon { width: 20px; height: 20px; }');
        css.sheet.insertRule('#leagues .league_content .league_table .data-list .data-row .data-column[column="nickname"].clubmate .nickname { color: #00CC00; }');
        css.sheet.insertRule('#leagues .league_content { max-width: 49rem !important; }');
        css.sheet.insertRule('#leagues .league_table .data-list .data-row.body-row.selected { background-color: rgb(158, 108, 37); }');
        css.sheet.insertRule('#leagues .league_table .data-list .data-row.body-row.player-row.selected { text-shadow: rgb(0, 0, 0) 1px 1px 0px, rgb(0, 0, 0) -1px 1px 0px, rgb(0, 0, 0) -1px -1px 0px, rgb(0, 0, 0) 1px -1px 0px; }');
        css.sheet.insertRule(`#leagues .league_table .data-list .data-row.body-row.player-row.selected .data-column[column="boosters"],
                              #leagues .league_table .data-list .data-row.body-row.player-row.selected .data-column[column="team"],
                              #leagues .league_table .data-list .data-row.body-row.player-row.selected .data-column[column="value"],
                              #leagues .league_table .data-list .data-row.body-row.player-row.selected .head-column[column="boosters"],
                              #leagues .league_table .data-list .data-row.body-row.player-row.selected .head-column[column="team"],
                              #leagues .league_table .data-list .data-row.body-row.player-row.selected .head-column[column="value"] {
                                  transition: none;
                              }`);
        css.sheet.insertRule('#leagues .league_opponent .player_team_block.opponent {padding-left:0.75rem !important;padding-right:0.75rem !important; margin-top:-10px !important;height:508px !important;border-radius: .4rem !important;}');
        css.sheet.insertRule('#leagues .league_opponent .player-panel-buttons {flex-direction: row !important; justify-content: center !important;}');
        css.sheet.insertRule('#leagues .league_opponent .player-panel-buttons .battle-action-button.green_button_L {min-width: 50%}');
        css.sheet.insertRule('#leagues .league_opponent .player-profile-picture {cursor:pointer !important}');
        css.sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="level"],
                              #leagues .league_content .league_table .data-list .data-row .head-column[column="level"],
                              #leagues .league_content .league_table .data-list .data-row .data-column[column="place"],
                              #leagues .league_content .league_table .data-list .data-row .head-column[column="place"] {
                                  min-width: 1.4rem !important;
                              }`);
        css.sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="player_league_points"],
                              #leagues .league_content .league_table .data-list .data-row .data-column[column="power"],
                              #leagues .league_content .league_table .data-list .data-row .data-column[column="team"],
                              #leagues .league_content .league_table .data-list .data-row .head-column[column="player_league_points"],
                              #leagues .league_content .league_table .data-list .data-row .head-column[column="power"],
                              #leagues .league_content .league_table .data-list .data-row .head-column[column="team"] {
                                  min-width: 2rem !important;
                              }`);
        css.sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="match_history"],
                              #leagues .league_content .league_table .data-list .data-row .data-column[column="match_history_sorting"],
                              #leagues .league_content .league_table .data-list .data-row .head-column[column="match_history"],
                              #leagues .league_content .league_table .data-list .data-row .head-column[column="match_history_sorting"] {
                                  min-width: 5.2rem !important;
                              }`);
        css.sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="match_history"] .result,
                              #leagues .league_content .league_table .data-list .data-row .data-column[column="match_history_sorting"] .result,
                              #leagues .league_content .league_table .data-list .data-row .head-column[column="match_history"] .result,
                              #leagues .league_content .league_table .data-list .data-row .head-column[column="match_history_sorting"] .result {
                                  width: 1.7rem !important;
                                  height: 1.7rem !important;
                                  line-height: 1.7rem !important;
                              }`);
        css.sheet.insertRule(`#leagues .league_content .league_table .data-list {
                                  overflow: hidden
                              }`); //Remove unnecessary scrollbar
        css.sheet.insertRule(`#leagues .league_opponent.hidden_girl {
                                  position: absolute;
                                  right: 0;
                                  top: 0;
                                  height: 100%;
                                  width: 15rem;
                                  transition: all .5s;
                                  opacity: 1;
                                  padding-top: 10px;
                              }`);
        css.sheet.insertRule(`#leagues .league_opponent {
                                  position: absolute;
                                  opacity: 0;
                                  right: -13rem;
                                  width: 15rem;
                                  min-width: 13rem;
                                  padding-top: 10px;
                              }`);

        if(config.RemoveChallengeColumn)
        {
            //remove challenge column and css for the pin inside the match history
            css.sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="can_fight"], #leagues .league_content .league_table .data-list .data-row .head-column[column="can_fight"] {
                                      display: none;
                                  }`);
            css.sheet.insertRule(`#leagues .league_content.hidden_girl .league_table .data-list .data-row .data-column[column="boosters"], #leagues .league_content.hidden_girl .league_table .data-list .data-row .head-column[column="boosters"] {
                                      min-width: 13.2rem;
                                  }`);
            css.sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row.body-row.player-row .data-column[column="match_history_sorting"] .player-pin img {
                                      width: 1.5rem;
                                      transform: scaleX(-1);
                                  }`);
            css.sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row.body-row.player-row .data-column[column="match_history_sorting"] .player-pin {
                                      opacity: .5;
                                  }`);
            css.sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row.body-row.player-row .data-column[column="match_history_sorting"] .player-pin.pinned {
                                      opacity: 1;
                                  }`);
        }

        //HH++ Sim Results
        css.sheet.insertRule('#leagues .matchRating { display: block !important; }');
        css.sheet.insertRule('#leagues .league_content .league_table .data-list .data-row .data-column[column="power"] .matchRating .matchRating-value { font-size: 12px; }');
        css.sheet.insertRule('#leagues .league_content .league_table .data-list .data-row .data-column[column="power"] .matchRating .matchRating-label { display: none; }');
    }

    function Leagues_run()
    {
        //delay execution if the gui is not ready
        if(document.querySelector('#leagues div.league_girl') === null) {
            setTimeout(Leagues_run, 50);
            return;
        }

        //vars
        let currentOpponent = null;

        //add a confirmation for the 15x button
        let btn = document.querySelector('#leagues .league_content .league_buttons .league_buttons_block .blue_button_L, #leagues .league_content .league_buttons .league_buttons_block .orange_button_L');
        if(btn !== null) {
            btn.parentNode.replaceChild(btn.cloneNode(true), btn);
            addMultipleBattlesButtonClick();
        }

        //add a div for the opponent view
        const div = document.createElement('div');
        div.setAttribute('class', 'league_opponent');
        document.querySelector('#leagues').appendChild(div);

        //sync css class hidden_girl from '#leagues div.league_girl' to '#leagues div.league_opponent'
        const leagueGirlNode = document.querySelector('#leagues div.league_girl');
        const leagueGirlNodeObserver = new MutationObserver((mus) => {
            mus.forEach(mu => {
                if(mu.type !== 'attributes' || mu.attributeName !== 'class') return;
                leagueGirlSync();
            });
        });
        function leagueGirlSync() {
            if(leagueGirlNode.classList.contains('hidden_girl')) {
                div.classList.add('hidden_girl');
            } else {
                div.classList.remove('hidden_girl');
            }
        }
        leagueGirlNodeObserver.observe(leagueGirlNode, {attributes: true});
        leagueGirlSync();

        //modify data list and add click event to header column, as the event listeners and highlighting are lost during sorting
        $(".head-column").click(modifyDataList)
        modifyDataList();

        //select last opponent
        let lastOpponentId = loadLastOpponentId();
        if(lastOpponentId !== null)
        {
            let opponent = opponents_list_getData(lastOpponentId);
            let opponentRow = getOpponentRow(lastOpponentId);
            if(opponent !== null && opponentRow !== null) selectOpponent(opponentRow, opponent);
        }

        function modifyDataList()
        {
            //go through all rows and add/change various things
            let opponentRows = document.querySelectorAll('#leagues .league_table .data-list .data-row.body-row');
            for(let i = 0; i < opponentRows.length; i++)
            {
                let opponentRow = opponentRows[i];
                let id = parseInt(opponentRow.querySelector('.data-column[column="nickname"] .nickname').getAttribute('id-member'));
                let opponent = opponents_list_getData(id);

                //add clubmate class to column
                if(Hero.infos.id !== id && Hero.club !== null && opponent.player.club !== null && Hero.club.id_club == opponent.player.club.id_club) {
                    opponentRow.querySelector('.data-column[column="nickname"]').classList.add('clubmate');
                }

                //remove the go_pre_battle class so that the code in addOpponentRowClick() no longer finds the button
                let btnGo = opponentRow.querySelector('.data-column[column="can_fight"] .go_pre_battle');
                if(btnGo !== null)
                {
                    btnGo.classList.remove('go_pre_battle');
                    btnGo.addEventListener("click", function() { loadingAnimation.start() });
                }

                //add a new event listener
                opponentRow.addEventListener("click", (event) => selectOpponent(event.currentTarget, opponent));

                //highlight row
                if(currentOpponent === opponent) opponentRow.classList.add('selected');
            }

            if(config.RemoveChallengeColumn)
            {
                setTimeout(() => {
                    //move the pin into the match history column
                    const playerMatchHistory = document.querySelector('.data-list .data-row.body-row.player-row .data-column[column="match_history_sorting"]');
                    playerMatchHistory.innerHTML = '';
                    playerMatchHistory.appendChild(document.querySelector('div.player-pin'));
                }, 1);
            }
        }

        function selectOpponent(row, opponent)
        {
            //highlight row
            document.querySelectorAll('#leagues .league_table .data-list .data-row.body-row').forEach((e) => e.classList.remove('selected'))
            row.classList.add('selected');

            //show opponent
            showOpponent(opponent);

            //hide league girl
            hideLeagueGirl();

            //save last selected opponent
            saveLastOpponentId(opponent.player.id_fighter);
        }

        function showOpponent(opponent)
        {
            currentOpponent = opponent;

            //opponent view
            let opponent_view = $('#leagues .league_opponent');
            opponent_view[0].innerHTML = '';

            //KK Code Line 24624 default.js v69097541 2023-08-03
            let rewards_tmp = opponent.rewards;
            let match_history_tmp = opponent.match_history;
            delete opponent.rewards;
            delete opponent.match_history;
            buildPlayerBlock(opponent, false, opponent_view);
            opponent.rewards = rewards_tmp;
            opponent.match_history = match_history_tmp;

            //open the hero page when clicking on the avatar
            document.querySelector('#leagues .league_opponent .player-profile-picture').addEventListener('click', (e) => {
                hero_page_popup({
                    id: opponent.player.id_fighter,
                    preview: false,
                    page: 'profile'
                });
            });

            let available_fights = getAvailableFights(opponent);

            //add clubname to opponent view
            const nutakuSessionId = getSessionId();
            if(opponent.player.club != null)
            {
                const aClubName = document.createElement('a');
                aClubName.setAttribute('style', 'font-size: 11px; color: lightsalmon; text-decoration: none; width: 158px; display: block; margin: 0 auto; -webkit-text-shadow: 3px 1px 5px #000; -moz-text-shadow: 3px 1px 5px #000; text-shadow: 3px 1px 5px #000;');
                aClubName.setAttribute('href', '/clubs.html?prev_page=leagues.html&view_club=' + opponent.player.club.id_club + (nutakuSessionId !== null ? '&sess=' + nutakuSessionId : ''));
                aClubName.setAttribute('title', opponent.player.club.name);
                aClubName.innerHTML = opponent.player.club.name;
                document.querySelector('#leagues .league_opponent .personal_info .player_basic_info').appendChild(aClubName);
            }

            //add pre-battle page link to the players name
            if(Hero.infos.id != opponent.player.id_fighter && available_fights > 0)
            {
                const divPlayerName = document.querySelector('#leagues .league_opponent .personal_info .player-name');
                const aPlayerName = document.createElement('a');
                aPlayerName.setAttribute('class', 'player-name');
                aPlayerName.setAttribute('style', 'color: white; text-decoration: none;');
                aPlayerName.setAttribute('href', '/leagues-pre-battle.html?id_opponent=' + opponent.player.id_fighter + (nutakuSessionId !== null ? '&sess=' + nutakuSessionId : ''));
                aPlayerName.setAttribute('title', divPlayerName.innerText);
                aPlayerName.innerHTML = divPlayerName.innerHTML;
                divPlayerName.parentNode.replaceChild(aPlayerName, divPlayerName);
            }

            //button container
            let container = document.querySelector('#leagues .league_opponent .player-panel-buttons');

            //1x/3x buttons
            let btn1x = document.createElement('div');
            let btn3x = document.createElement('div');
            btn1x.setAttribute('class', 'green_button_L battle-action-button league-single-battle-button');
            btn3x.setAttribute('class', 'green_button_L battle-action-button league-multiple-battle-button');
            btn1x.innerHTML = buildChallengeButtonInnerHtml(1);
            btn3x.innerHTML = buildChallengeButtonInnerHtml(available_fights > 1 ? available_fights : 3);
            if(available_fights > 0) {
                btn1x.addEventListener("click", (event) => btnChallenge_click(btn1x, btn3x, opponent, 1));
            } else {
                btn1x.setAttribute('disabled', 'disabled');
            }
            if(available_fights > 1) {
                btn3x.addEventListener("click", (event) => btnChallenge_click(btn1x, btn3x, opponent, available_fights));
            } else {
                btn3x.setAttribute('disabled', 'disabled');
            }
            container.appendChild(btn1x);
            container.appendChild(btn3x);

            //Show rena's Battle Sim (HH++ required)
            showBattleSim(opponent);
        }

        function showBattleSim(opponent)
        {
            if(!window.HHPlusPlus) return;

            //sim results available?
            if(opponent.sim) {
                //show rena's Battle Sim
                (new window.HHPlusPlus.League).display(opponent.sim);
            } else {
                //trigger rena's Battle Sim
                window.opponent_fighter = opponent;
            }
        }

        function btnChallenge_click(btn1x, btn3x, opponent, fights)
        {
            if(Hero.energies.challenge.amount >= fights)
            {
                //disable the buttons and remove the event listeners
                btn1x.setAttribute('disabled', 'disabled');
                btn3x.setAttribute('disabled', 'disabled');
                const btn1xClone = btn1x.cloneNode(true);
                const btn3xClone = btn3x.cloneNode(true);
                btn1x.parentNode.replaceChild(btn1xClone, btn1x);
                btn3x.parentNode.replaceChild(btn3xClone, btn3x);
                btn1x = btn1xClone;
                btn3x = btn3xClone;

                loadingAnimation.start();

                //open the battle page first
                const nutakuSessionId = getSessionId();
                $.ajax({ url: '/leagues-pre-battle.html?id_opponent=' + opponent.player.id_fighter + (nutakuSessionId !== null ? '&sess=' + nutakuSessionId : ''), success: function(data) {

                    //change referer
                    window.history.replaceState(null, '', (fights === 1 ? '/league-battle.html?number_of_battles=1&id_opponent=' + opponent.player.id_fighter : '/leagues-pre-battle.html?id_opponent=' + opponent.player.id_fighter) + (nutakuSessionId !== null ? '&sess=' + nutakuSessionId : ''));

                    let params = {
                        action: "do_battles_leagues",
                        id_opponent: opponent.player.id_fighter,
                        number_of_battles: fights
                    };
                    hh_ajax(params, function(data) {
                        //change referer
                        window.history.replaceState(null, '', '/leagues.html' + (nutakuSessionId !== null ? '?sess=' + nutakuSessionId : ''));

                        //remove redirect
                        data.rewards.redirectUrl = '';

                        loadingAnimation.stop();
                        RewardHandlePopup(data.rewards);
                        Hero.updates(data.hero_changes);
                        if(config.ObjectivePopupEnabled && data.objective_points) {
                            data.rewards.objective_points = data.objective_points;
                            objectivePopup.show(data.rewards);
                        }

                        let lostFights = 0;
                        for (const reward of data.rewards.data.rewards) {
                            if(reward.type === 'battle_lost') {
                                lostFights = reward.value;
                                break;
                            }
                        }

                        //fill match history to prevent further fights
                        const available_fights = fillHistoryAndUpdateOpponentRow(opponent, fights, lostFights, data.rewards.heroChangesUpdate.league_points);

                        //update 1x/3x
                        if(available_fights > 0)
                        {
                            btn1x.removeAttribute('disabled');
                            btn1x.addEventListener("click", (event) => btnChallenge_click(btn1x, btn3x, opponent, 1));

                            if(available_fights > 1) {
                                btn3x.innerHTML = buildChallengeButtonInnerHtml(available_fights);
                                btn3x.removeAttribute('disabled');
                                btn3x.addEventListener("click", (event) => btnChallenge_click(btn1x, btn3x, opponent, available_fights));
                            }
                        }
                    })
                }});
            }
            else
            {
                //temporary solution
                const needed = fights - Hero.energies.challenge.amount;
                const tmpAmount = shared.Hero.energies.challenge.amount;
                shared.Hero.energies.challenge.amount = shared.Hero.energies.challenge.max_regen_amount - needed;
                document.querySelector('button.orange_button_L.refill-challenge-points').click();
                shared.Hero.energies.challenge.amount = tmpAmount;

                //old code
                /*HHPopupManager.show("no_energy_challenge", {
                    energy: "challenge",
                    needed: fights - Hero.energies.challenge.amount
                }, () => btnChallenge_click(btn1x, btn3x, opponent, fights))*/
            }
        }

        function RewardHandlePopup(rewards)
        {
            if(!rewards.lose)
            {
                //restore rewards if a fight was previously lost (the lost screen permanently hides the rewards)
                const reward_holder = document.querySelector('#reward_holder');
                if(reward_holder !== null) {
                    reward_holder.setAttribute('style', '');
                }
            }
            Reward.handlePopup(rewards);
        }

        function fillHistoryAndUpdateOpponentRow(opponent, fights, lostFights, pointsTotal)
        {
            let keyPoints = 0;
            if((fights === 3 && pointsTotal > 73 /*25+25+24*/) || (fights === 2 && pointsTotal > 48 /*25+24*/)) {
                keyPoints = 25; //3x25 or 2x25 1x24
            } else if((fights === 3 && pointsTotal < 11 /*3+3+4*/) || (fights === 2 && pointsTotal < 8 /*3+4*/)) {
                keyPoints = 3; //3x3 or 2x3 1x4
            }
            let available_fights = 3;
            if(opponent.match_history[parseInt(opponent.player.id_fighter)] !== false) {
                let match_history_html = '';
                for(let i = 0; i < 3; i++) {
                    let mh = opponent.match_history[parseInt(opponent.player.id_fighter)][i];
                    if(mh === null && fights !== 0) {
                        let attacker_won;
                        let match_points;
                        if(fights > 1) {
                            attacker_won = (lostFights > 2 - i ? "lost" : "won");
                            match_points = "?";
                            if(keyPoints !== 0) {
                                if(i < 2) {
                                    match_points = keyPoints.toString();
                                    pointsTotal -= keyPoints;
                                } else {
                                    match_points = pointsTotal.toString();
                                }
                            }
                        } else {
                            attacker_won = (lostFights === 1 ? "lost" : "won");
                            match_points = pointsTotal.toString();
                            fights = 0;
                        }
                        mh = opponent.match_history[parseInt(opponent.player.id_fighter)][i] = { attacker_won, match_points };
                    }

                    if(mh !== null) {
                        available_fights--;
                        match_history_html += '<div class="result ' + mh.attacker_won + '">' + mh.match_points + '</div>';
                    } else {
                        match_history_html += '<div class="result"></div>';
                    }
                }

                //update match history
                getOpponentColumn(opponent.player.id_fighter, 'match_history_sorting').innerHTML = match_history_html;

                //remove "Go" button and event listeners when no more fights are available
                if(available_fights === 0)
                {
                    //remove the "Go" button in the list
                    let canFightColumn = getOpponentColumn(opponent.player.id_fighter, 'can_fight');
                    canFightColumn.innerHTML = '';
                    canFightColumn.parentNode.replaceChild(canFightColumn.cloneNode(true), canFightColumn);

                    //remove the pre-battle page link in the opponent view
                    const aPlayerName = document.querySelector('#leagues .league_opponent .personal_info .player-name');
                    aPlayerName.removeAttribute('href');
                }
                return available_fights;
            }
        }

        function buildChallengeButtonInnerHtml(available_fights)
        {
            return '<div class="action-label">Challenge!</div><div class="action-cost"><div><span class="energy_challenge_icn"></span> x'+available_fights+'</div></div>';
        }

        function hideLeagueGirl()
        {
            let btnGirl = document.getElementById('toggle_columns');
            if(btnGirl !== null && !btnGirl.classList.contains('hidden_girl')) {
                btnGirl.click();
            }
        }

        function getOpponentColumn(id, column)
        {
            return getOpponentRow(id).querySelector('.data-column[column="'+column+'"]');
        }

        function getOpponentRow(id)
        {
            let row = document.querySelector('#leagues .league_table .data-list .data-row .data-column[column="nickname"] .nickname[id-member="'+id+'"]');
            return row !== null ? row.parentNode.parentNode : null;
        }

        function getAvailableFights(opponent)
        {
            let counter = 0;
            if(opponent.match_history[parseInt(opponent.player.id_fighter)] !== false) {
                for(let i = 0; i < 3; i++) {
                    if(opponent.match_history[parseInt(opponent.player.id_fighter)][i] === null) counter++;
                }
            }
            return counter;
        }

        function opponents_list_getData(id)
        {
            for(let i = 0; i < opponents_list.length; i++) {
                if(opponents_list[i].player.id_fighter == id) return opponents_list[i];
            }
            return null;
        }

        function saveLastOpponentId(id)
        {
            localStorage.setItem('HHLeaguesPlusPlusLastOpponentId', id);
        }

        function loadLastOpponentId()
        {
            return localStorage.getItem('HHLeaguesPlusPlusLastOpponentId');
        }

        //modified KK function, Code Line 27058 default.js v69097541 2023-08-03
        function addMultipleBattlesButtonClick() {
            $(".multiple-battles").on("click", function() {
                if(confirm('Perform 15x?')) {
                    $(this).blur();
                    var startBattles = function startBattles() {
                        return ajaxBattle("challenge", {
                            action: "do_battles_leagues",
                            number_of_battles: 15
                        })
                    };
                    var hc_price = $(this).attr("price");
                    hc_confirm(hc_price, startBattles)
                }
            })
        }
    }

    function LeaguesPreBattle_css()
    {
        if(!config.ChallengeX3ButtonEnabled)
        {
            let css = document.createElement('style');
            document.head.appendChild(css);

            css.sheet.insertRule('.league-multiple-battle-button { display:none !important; }');
        }
    }

    async function getHHPlusPlusConfig() {
        return (async () => {
            if (window.hhPlusPlusConfig != null) return window.hhPlusPlusConfig;
            await new Promise($);
            return window.hhPlusPlusConfig;
        })();
    }

    async function loadConfig()
    {
        //default config
        let config = {
            ObjectivePopupEnabled: true,
            ChallengeX3ButtonEnabled: true,
            RemoveChallengeColumn: false
        };

        //if HH++ is installed, we load the config from there
        const hhPlusPlusConfig = await getHHPlusPlusConfig();
        if (hhPlusPlusConfig != null)
        {
            hhPlusPlusConfig.registerGroup({
                key: 'HHLeaguesPlusPlus',
                name: 'HH Leagues++'
            });

            hhPlusPlusConfig.registerModule({
                group: 'HHLeaguesPlusPlus',
                configSchema: {
                    baseKey: 'ChallengeX3ButtonEnabled',
                    label: 'Challenge x3 button enabled',
                    default: true,
                },
                run() {
                    config.ChallengeX3ButtonEnabled = true;
                },
            });
            config.ChallengeX3ButtonEnabled = false;

            hhPlusPlusConfig.registerModule({
                group: 'HHLeaguesPlusPlus',
                configSchema: {
                    baseKey: 'ObjectivePopupEnabled',
                    label: 'Objective popup enabled',
                    default: true,
                },
                run() {
                    config.ObjectivePopupEnabled = true;
                },
            });
            config.ObjectivePopupEnabled = false;

            hhPlusPlusConfig.registerModule({
                group: 'HHLeaguesPlusPlus',
                configSchema: {
                    baseKey: 'RemoveChallengeColumn',
                    label: 'Remove challenge column (Hint: Click on the player\'s name to open the pre-battle page)',
                    default: false,
                },
                run() {
                    config.RemoveChallengeColumn = true;
                },
            });
            config.RemoveChallengeColumn = false;

            hhPlusPlusConfig.loadConfig();
            hhPlusPlusConfig.runModules();
        }

        return config;
    }
})(unsafeWindow);
