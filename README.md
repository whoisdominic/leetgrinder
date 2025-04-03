# LeetGrinder

A Chrome extension to help you track and improve your LeetCode problem-solving skills.

Requires an Airtable account with the following base:

You can create a new base with the following [template]("")

## Roadmap

- [ ] Update airtable template to include Blind 75 questions
- [ ] Add a ability to auto add Companies
- [ ] Add a ability to auto add problem types

## Installation

### From GitHub Releases (Recommended)

1. Go to the [Releases](https://github.com/yourusername/leetgrinder/releases) page
2. Download the latest `leetgrinder.zip` file
3. Extract the zip file to a folder on your computer
4. Open Chrome and go to `chrome://extensions/`
5. Enable "Developer mode" in the top right
6. Click "Load unpacked" and select the extracted folder

### Development Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/whoisdominic/leetgrinder.git
   cd leetgrinder
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Build the extension:

   ```bash
   yarn build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` folder

## Features

- Track your progress on LeetCode problems
- Rate your comfort level with each problem
- Get personalized problem recommendations
- Sync your data with Airtable

## Development

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn test` - Run tests

## License

MIT
