
# Change Log
All notable changes to this project will be documented in this file.

## [0.16.1] - 2024-03-27

### Fixed
- Popup of the hero page fixed

## [0.16.0] - 2024-03-25

### Added
- Added club name to opponent view
- Added pre-battle page link to the opponent's nickname
- New setting "Remove Challenge Column" is available if HH++ is installed. It removes the Challenge Column ("Go" buttons) and moves the pin on the player row to the match history

### Changed
- Compatibility update for the code with the new bundler, which is expected to be released on Wednesday

## [0.15.0] - 2024-03-05

### Changed
- The setting "Challenge x3 button enabled" will now remove the x3 button and the x1 button will be displayed larger
- The setting "Challenge x3 button enabled" has been extended to the pre-battle page
- Minor style changes

## [0.14.1] - 2024-02-22

### Fixed
- The problem with the Session ID on Nutaku has been fixed (since yesterday's game update)

## [0.14.0] - 2024-02-20

### Added
- The following settings are available if HH++ is installed: Challenge x3 button enabled, Objective popup enabled

## [0.13.1] - 2024-02-12

### Added
- Objective popup (this is the popup that appears in the top left corner when you get points in other events)

## [0.13.0] - 2024-01-28

### Added
- TPSH support
- hornyheroes.com support

### Fixed
- Kinkoid's function Reward.handlePopup(data.rewards) hides the rewards permanently when the lost screen is displayed once. A fix has been added to show the rewards on subsequent won fights

## [0.12.3] - 2024-01-26

### Added
- GPSH support

## [0.12.2] - 2024-01-17

### Changed
- Updating the URL from the league page after the game update

## [0.12.1] - 2024-01-04

### Added
- Style improvements to make the player row more legible when it is selected and/or at the top of the table

## [0.12.0] - 2023-11-02

### Added
- The Challenge x1 button now works directly on the league page. The Battle Sequence is skipped (if someone wants to see the Battle Sequence, they can still do so via the "Go" button)

### Changed
- Some CSS updates (e.g. Change Team button)

## [0.11.1] - 2023-08-31

### Changed
- Improved logic for won (green) or lost (red) fights in the match history

## [0.11.0] - 2023-08-30

### Added
- Refill feature added to the x1/x2/x3 buttons
- Fill in logically assignable points (x3 75/74/10/9, x2 50/49/7/6) and when x2/x3 fights have been logically all won (green) or lost (red) in the match history

### Fixed
- The script sometimes did not work on very slow computers because the GUI was not yet ready
- x1-fight did not work directly after an x3-fight (instead the page was refreshed once)

## [0.10.1] - 2023-08-21

### Added
- Using the live battle simulation data from HH++ (v1.38.0 or higher required)

### Removed
- Live battle simulation removed (now included in HH++)
- Team theme column (meanwhile included in HH++)
- Fade expired opponent boosters (meanwhile included in HH++)

## [0.9.4] - 2023-08-18

### Added
- Style Tweaks for the new Battle Sim

## [0.9.0] - 2023-08-16

### Added
- Club member nicknames in green

### Changed
- Code cleaned up

## [0.8.0-0.8.1] - 2023-08-15

### Added
- Remember last selected opponent
- Compatibility for the current code on the test server

### Fixed
- Match history (x2/x3 button)

## [0.6-0.7.1] - 2023-08-10

### Added
- CSS tweak so that the nicknames can be read better

### Fixed
- The script does not work when you are done with the league

## [0.4-0.5] - 2023-08-09

### Added
- Added fix for the KK bug when you have the league girl

## [0.3] - 2023-08-08

### Changed
- Compatibility update for the new code on the test server
  
## [0.2] - 2023-08-07

### Added
- Fade expired boosters (@430i Thank you for the basic idea)
- Confirmation for 15x button (@Ol Sheriff Joe)

## [0.1] - 2023-08-06

Initial release
