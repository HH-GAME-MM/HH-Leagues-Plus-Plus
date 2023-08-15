// ==UserScript==
// @name         HH Leagues++
// @version      0.8.1
// @description  Upgrade League with various features
// @author       -MM-
// @match        https://*.hentaiheroes.com/tower-of-fame.html
// @match        https://*.hentaiheroes.com/teams.html
// @match        https://nutaku.haremheroes.com/tower-of-fame.html
// @match        https://nutaku.haremheroes.com/teams.html
// @match        https://*.comixharem.com/tower-of-fame.html
// @match        https://*.comixharem.com/teams.html
// @match        https://*.pornstarharem.com/tower-of-fame.html
// @match        https://*.pornstarharem.com/teams.html
// @match        https://*.gayharem.com/tower-of-fame.html
// @match        https://*.gayharem.com/teams.html
// @run-at       document-end
// @namespace    https://github.com/HH-GAME-MM/HH-Leagues-Plus-Plus
// @updateURL    https://github.com/HH-GAME-MM/HH-Leagues-Plus-Plus/raw/main/HH-Leagues-Plus-Plus.user.js
// @downloadURL  https://github.com/HH-GAME-MM/HH-Leagues-Plus-Plus/raw/main/HH-Leagues-Plus-Plus.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hentaiheroes.com
// @grant        none
// ==/UserScript==

//CHANGELOG: https://github.com/HH-GAME-MM/HH-Leagues-Plus-Plus/raw/main/CHANGELOG.md

(function() {
    //definitions
    'use strict';
    /*global Hero,GT,IMAGES_URL,opponents_list,buildPlayerBlock,hero_page_popup,loadingAnimation,hh_ajax,Reward,$*/

    if(window.location.href.includes('.com/tower-of-fame.html'))
    {
        TowerOfFame_css();
        setTimeout(TowerOfFame_run, 1);
    }
    else if(window.location.href.includes('.com/teams.html'))
    {
        setTimeout(Teams_run, 1);
    }

    function TowerOfFame_css()
    {
        let css = document.createElement('style');
        document.head.appendChild(css);

        css.sheet.insertRule('.league_end_in { min-width: 110px }');
        css.sheet.insertRule('#leagues .league_content .league_buttons {max-width:100% !important;}');
        css.sheet.insertRule('#leagues .league_content .league_buttons .league_buttons_block {width:20.5rem !important;}');
        css.sheet.insertRule('#leagues .league_content .league_buttons .league_buttons_block .multiple-battles {height:43px !important;padding-top:6px !important;}');
        css.sheet.insertRule('#leagues .league_content .league_buttons .league_buttons_block .blue_button_L, #leagues .league_content .league_buttons .league_buttons_block .orange_button_L { display:none !important; width: 116px !important; padding: 10px}');
        css.sheet.insertRule('#leagues .league_content .league_buttons .league_buttons_block .changeTeam { margin-left:10px;font-size:12px;padding-left:16px !important }');
        css.sheet.insertRule('#leagues .league_content .league_buttons .change_team_container #change_team {padding: 10px !important;}');
        css.sheet.insertRule('#leagues .league_content .league_table .data-list .data-row .data-column[column="match_history_sorting"] .result.unknown { background-image: linear-gradient(to top,#244922 0,#979f96 100%) }');
        css.sheet.insertRule('#leagues .league_content .league_table .data-list .data-row .data-column[column="team"] { column-gap: 3px; }');
        css.sheet.insertRule('#leagues .league_content .league_table .data-list .data-row .data-column[column="team"] .team-theme.icon { width:20px;height:20px }');
        css.sheet.insertRule('#leagues .league_content {max-width:49rem !important;}');
        css.sheet.insertRule('#leagues .league_table .data-list .data-row.body-row.selected { background-color: rgba(254, 184, 37, .5) }');
        css.sheet.insertRule('#leagues .league_table .nicescroll-rails {right:15rem !important;}');
        css.sheet.insertRule('#leagues .league_opponent .player_team_block.opponent {padding-left:0.75rem !important;padding-right:0.75rem !important;}');
        css.sheet.insertRule('#leagues .league_opponent .player-panel-buttons {flex-direction: row !important;}');
        css.sheet.insertRule('#leagues .league_opponent .player-panel-buttons .battle-action-button.green_button_L {min-width: 50%;}');
        css.sheet.insertRule('#leagues .league_opponent .player-profile-picture {cursor:pointer !important;}');
        css.sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="level"], #leagues .league_content .league_table .data-list .data-row .data-column[column="player_league_points"], #leagues .league_content .league_table .data-list .data-row .data-column[column="power"], #leagues .league_content .league_table .data-list .data-row .data-column[column="team"], #leagues .league_content .league_table .data-list .data-row .head-column[column="level"], #leagues .league_content .league_table .data-list .data-row .head-column[column="player_league_points"], #leagues .league_content .league_table .data-list .data-row .head-column[column="power"], #leagues .league_content .league_table .data-list .data-row .head-column[column="team"] {
  min-width: 2rem !important;
}`);
        css.sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="match_history"], #leagues .league_content .league_table .data-list .data-row .data-column[column="match_history_sorting"], #leagues .league_content .league_table .data-list .data-row .head-column[column="match_history"], #leagues .league_content .league_table .data-list .data-row .head-column[column="match_history_sorting"] {
  min-width: 5.2rem !important;
}`);
        css.sheet.insertRule(`#leagues .league_content .league_table .data-list .data-row .data-column[column="match_history"] .result, #leagues .league_content .league_table .data-list .data-row .data-column[column="match_history_sorting"] .result, #leagues .league_content .league_table .data-list .data-row .head-column[column="match_history"] .result, #leagues .league_content .league_table .data-list .data-row .head-column[column="match_history_sorting"] .result {
  width: 1.7rem !important;
  height: 1.7rem !important;
  line-height: 1.7rem !important;
}`);
        //temporary compatibility update for prod and test server 2023-08-14
        css.sheet.insertRule(`#leagues.hidden_girl .league_opponent, #leagues .league_opponent.hidden_girl {
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
        //temporary compatibility update for prod and test server 2023-08-14
        css.sheet.insertRule(`#change_team {
  margin-left: 10px;
  font-size: 12px;
  padding-left: 16px !important;
  width: 116px !important;
  padding: 10px;
  height: 43px !important;
}`);
    }

    function TowerOfFame_run()
    {
        //vars
        let currentOpponent = null;

        //add a confirmation for the 15x button
        let btn = document.querySelector('#leagues .league_content .league_buttons .league_buttons_block .blue_button_L, #leagues .league_content .league_buttons .league_buttons_block .orange_button_L');
        if(btn !== null) {
            btn.parentNode.replaceChild(btn.cloneNode(true), btn);
            addMultipleBattlesButtonClick();
        }

        //add change team button if none exists
        if(document.getElementById('change_team') === null) //temporary compatibility update for prod and test server 2023-08-14
        {
            btn = document.createElement('a');
            btn.setAttribute('class', 'blue_button_L changeTeam');
            btn.innerHTML = '<div>Change team</div>';
            btn.addEventListener("click", function() {
                localStorage.setItem('battle_type', 'leagues');
                localStorage.setItem('leagues_id', Hero.infos.id);
                window.location.href = '/teams.html';
            });
            document.querySelector('.league_buttons_block').appendChild(btn);
        }

        //show 15x button and change team button
        document.querySelectorAll('#leagues .league_content .league_buttons .league_buttons_block .blue_button_L, #leagues .league_content .league_buttons .league_buttons_block .orange_button_L').forEach((e) => e.setAttribute('style', 'display:block !important'));

        //add a div for the opponent view
        const div = document.createElement('div');
        div.setAttribute('class', 'league_opponent');
        document.querySelector('#leagues').appendChild(div);

        //sync css class hidden_girl from '#leagues div.league_girl' to '#leagues div.league_opponent'
        //compatibility for prod and test server 2023-08-14
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
            //go through all rows, replace all event listeners and change the team column to the team theme
            let opponentRows = document.querySelectorAll('#leagues .league_table .data-list .data-row.body-row');
            for(let i = 0; i < opponentRows.length; i++)
            {
                let id = parseInt(opponentRows[i].querySelector('.data-column[column="nickname"] .nickname').getAttribute('id-member'));
                let opponent = opponents_list_getData(id);

                //remove event listeners for almost all columns
                let columns = opponentRows[i].querySelectorAll('.data-column:not([column="can_fight"])');
                for(let j = 0; j < columns.length; j++) {

                    //change team column to team theme
                    if(columns[j].getAttribute('column') === 'team')
                    {
                        let teamThemeHtml = '';
                        if (!opponent.player.team.theme_elements.length) {
                            teamThemeHtml = '<img class="team-theme icon " src="' + IMAGES_URL + '/pictures/girls_elements/Multicolored.png" tooltip="' + GT.design.balanced_theme_flavor + '">'
                        } else {
                            opponent.player.team.theme_elements.forEach((e) => {
                                teamThemeHtml += '<img class="team-theme icon " src="' + e.ico_url + '" tooltip="' + e.flavor + '">'
                            })
                        }
                        columns[j].innerHTML = teamThemeHtml;
                    }

                    //fade expired opponent boosters
                    if(Hero.infos.id !== id && columns[j].getAttribute('column') === 'boosters')
                    {
                        columns[j].querySelectorAll('div[type=booster]').forEach((e) => {
                            if (JSON.parse(e.getAttribute('data-d')).expiration === 0) {
                                e.setAttribute('style', 'border:1px solid red;opacity:0.5');
                            }
                        });
                    }

                    columns[j].parentNode.replaceChild(columns[j].cloneNode(true), columns[j]);
                }

                //remove the go_pre_battle class so that the code in addOpponentRowClick() no longer finds the button (compatibility for new code on test server)
                let btnGo = opponentRows[i].querySelector('.data-column[column="can_fight"] .go_pre_battle');
                if(btnGo !== null)
                {
                    btnGo.classList.remove('go_pre_battle');
                    btnGo.addEventListener("click", function() { loadingAnimation.start() });
                }

                //add a new event listener
                opponentRows[i].addEventListener("click", (event) => selectOpponent(event.currentTarget, opponent));

                //highlight row
                if(currentOpponent === opponent) opponentRows[i].classList.add('selected');
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
                hero_page_popup({id:opponent.player.id_fighter});
            });

            //TODO: add clubname to opponent view

            let available_fights = getAvailableFights(opponent);

            //button container
            let container = document.querySelector('#leagues .league_opponent .player-panel-buttons');

            //1x
            let btn1x = document.createElement('div');
            btn1x.setAttribute('class', 'green_button_L battle-action-button league-single-battle-button');
            btn1x.innerHTML = '<div class="action-label">Challenge!</div><div class="action-cost"><div><span class="energy_challenge_icn"></span> x1</div></div>';
            if(available_fights > 0 && Hero.energies.challenge.amount > 0) {
                btn1x.addEventListener("click", function() {

                    //disable the button on first click
                    let $this = $(event.currentTarget);
                    if($this.attr("disabled") === 'disabled') return;
                    $this.attr("disabled", true);

                    loadingAnimation.start();
                    window.location.href = "/league-battle.html?number_of_battles=1&id_opponent=" + opponent.player.id_fighter
                });
            } else {
                btn1x.setAttribute('disabled', 'disabled');
            }
            container.appendChild(btn1x);

            //3x
            let btn3x = document.createElement('div');
            btn3x.setAttribute('class', 'green_button_L battle-action-button league-multiple-battle-button');
            btn3x.innerHTML = '<div class="action-label">Challenge!</div><div class="action-cost"><div><span class="energy_challenge_icn"></span> x'+(available_fights > 1 ? available_fights : 3)+'</div></div>';
            if(available_fights > 1 && Hero.energies.challenge.amount > 1 && available_fights <= Hero.energies.challenge.amount) {
                btn3x.addEventListener("click", function() {

                    //disable the button on first click
                    let $this = $(event.currentTarget);
                    if($this.attr("disabled") === 'disabled') return;
                    $this.attr("disabled", true);

                    //disable the 1x button
                    btn1x.setAttribute('disabled', 'disabled');

                    loadingAnimation.start();

                    //change referer
                    window.history.replaceState(null, '', '/leagues-pre-battle.html?id_opponent='+opponent.player.id_fighter);

                    let params = {
                        action: "do_battles_leagues",
                        id_opponent: opponent.player.id_fighter,
                        number_of_battles: available_fights
                    };
                    hh_ajax(params, function(data) {
                        //change referer
                        window.history.replaceState(null, '', '/tower-of-fame.html');

                        //remove redirect
                        data.rewards.redirectUrl = '';

                        loadingAnimation.stop();
                        Reward.handlePopup(data.rewards);
                        Hero.updates(data.hero_changes);

                        //fill match history to prevent further fights
                        fillHistoryAndUpdateOpponentRow(opponent);
                    })
                });
            } else {
                btn3x.setAttribute('disabled', 'disabled');
            }
            container.appendChild(btn3x);

            //Run Battle Sim from HHPlusPlus Script
            HHPlusPlus_RunBattleSim(opponent, available_fights);
        }

        function HHPlusPlus_RunBattleSim(opponent_fighter, available_fights)
        {
            if(!window.HHPlusPlus) return;

            //use the snapshot data the first time and start a request to retrieve the actual data (only required for accurate battle sim)
            if(!window.loadedLeagueData) window.loadedLeagueData = new Map();
            let loadedData = window.loadedLeagueData.get(opponent_fighter.player.id_fighter);
            if(loadedData == null)
            {
                //use snapshot data
                window.hero_data = opponents_list_getData(Hero.infos.id).player;
                window.opponent_fighter = opponent_fighter;

                //retrieve the actual data only when fights are available
                if(available_fights > 0)
                {
                    $.ajax({ url: '/leagues-pre-battle.html?id_opponent=' + opponent_fighter.player.id_fighter, success: function(data) {
                        let html = (new DOMParser()).parseFromString(data, 'text/html');
                        let scriptNodes = html.querySelectorAll('script:not([src])');
                        for(let i = 0; i < scriptNodes.length; i++)
                        {
                            let script = scriptNodes[i].innerHTML.trimLeft();
                            if(script.startsWith('var hero_data = {') && script.includes('var opponent_fighter = {'))
                            {
                                eval(script.replace('var hero_data = {', 'window.hero_data_tmp = {').replace('var opponent_fighter = {', 'window.opponent_fighter_tmp = {'));
                                window.loadedLeagueData.set(opponent_fighter.player.id_fighter, {
                                    hero_data: window.hero_data_tmp,
                                    opponent_fighter: window.opponent_fighter_tmp
                                });
                                delete window.hero_data_tmp;
                                delete window.opponent_fighter_tmp;

                                //update opponent
                                if(currentOpponent === opponent_fighter) showOpponent(opponent_fighter);
                                return;
                            }
                        }
                    }});
                }
            }
            else
            {
                //use actual data
                window.hero_data = loadedData.hero_data;
                window.opponent_fighter = loadedData.opponent_fighter;
            }

            //HHPlusPlus Battle Sim
            //Sources: hh-plus-plus/src/modules/BattleSimulatorModule/index.js
            //Sources: hh-plus-plus/src/modules/BattleSimulatorModule/League.js
            let simManager = new window.HHPlusPlus.League;
            const {player, opponent} = simManager.extract();
            const simulator = new window.HHPlusPlus.Simulator({player, opponent});
            const result = simulator.run();
            simManager.display(result);

            //mark snapshot data with exclamation mark
            if(loadedData == null)
            {
                document.querySelectorAll('#leagues .league_opponent .matchRating-value').forEach(function(e) {
                    e.innerHTML = '! ' + e.innerHTML + ' !';
                });
            }
        }

        function hideLeagueGirl()
        {
            let btnGirl = document.getElementById('toggle_columns');
            if(btnGirl !== null && !btnGirl.classList.contains('hidden_girl')) {
                btnGirl.click();
            }
        }

        function fillHistoryAndUpdateOpponentRow(opponent)
        {
            if(opponent.match_history[parseInt(opponent.player.id_fighter)] !== false) {
                let match_history_html = '';
                for(let i = 0; i < 3; i++) {
                    let mh = opponent.match_history[parseInt(opponent.player.id_fighter)][i];
                    if(mh === null) {
                        mh = opponent.match_history[parseInt(opponent.player.id_fighter)][i] = { attacker_won: "unknown", match_points: "?" };
                    }

                    match_history_html += '<div class="result ' + mh.attacker_won + '">' + mh.match_points + '</div>';
                }

                //update match history
                getOpponentColumn(opponent.player.id_fighter, 'match_history_sorting').innerHTML = match_history_html;

                //remove "Go" button and event listeners
                let canFightColumn = getOpponentColumn(opponent.player.id_fighter, 'can_fight');
                canFightColumn.innerHTML = '';
                canFightColumn.parentNode.replaceChild(canFightColumn.cloneNode(true), canFightColumn);
            }
        }

        function getOpponentColumn(id, column)
        {
            return getOpponentRow(id).querySelector('.data-column[column="'+column+'"]');
        }

        function getOpponentRow(id)
        {
            return document.querySelector('#leagues .league_table .data-list .data-row .data-column[column="nickname"] .nickname[id-member="'+id+'"]').parentNode.parentNode;
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

    function Teams_run()
    {
        //temporary compatibility update for prod and test server 2023-08-14
        if(localStorageGetItem("leagues_id") === '') return;

        //remove event listeners
        let btn = $("#btn-select-team")[0];
        btn.parentNode.replaceChild(btn.cloneNode(true), btn);

        //add modified event listener
        addSelectButtonClickEvent();

        //modified KK function, Code Line 35652 default.js v69097541 2023-08-03
        function addSelectButtonClickEvent() {
            $("#btn-select-team").on("click", function(event) {
                event.preventDefault();
                let battle_type = localStorage.getItem('battle_type');
                var params = {
                    action: "select_team",
                    id_team: document.querySelector('.team-slot-container.selected-team').getAttribute('data-id-team'),
                    battle_type: battle_type
                };
                var redirectUrl = function redirectUrl(data) {
                    if (data.redirect_url) {
                        var url = data.redirect_url;
                        if (battle_type === "trolls") {
                            url += "?id_opponent=" + localStorageGetItem("troll_id")
                        }
                        if (battle_type === "pantheon") {
                            url += "?id_opponent=" + localStorageGetItem("pantheon_id")
                        }
                        if (battle_type === "leagues") {
                            let id_opponent = localStorageGetItem("leagues_id");
                            if(id_opponent == Hero.infos.id) {
                                url = "/tower-of-fame.html"
                            } else {
                                url = "/leagues-pre-battle.html?id_opponent=" + id_opponent
                            }
                        }
                        return window.location.href = url
                    }
                };
                hh_ajax(params, redirectUrl)
            })
        }
    }
})();
