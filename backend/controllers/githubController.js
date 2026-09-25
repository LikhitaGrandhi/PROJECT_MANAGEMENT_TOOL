const axios = require("axios");

const getGithubRepository = async (req, res) => {
    try {
        const { owner, repo } = req.query;

        if (!owner || !repo) {
            return res.status(400).json({
                success: false,
                message: "Please provide owner and repo"
            });
        }

        const response = await axios.get(
            `https://api.github.com/repos/${owner}/${repo}`
        );

        const data = response.data;

        res.status(200).json({
            success: true,
            github: {
                name: data.name,
                fullName: data.full_name,
                description: data.description,
                stars: data.stargazers_count,
                forks: data.forks_count,
                openIssues: data.open_issues_count,
                language: data.language,
                url: data.html_url
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to fetch GitHub repository data"
        });
    }
};

module.exports = {
    getGithubRepository
};