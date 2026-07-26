const STUDY_QUESTIONS = {
    python: [
        {
            question: "What is the output of type(lambda: None) in Python?",
            options: [
                "<class 'function'>",
                "<class 'lambda'>",
                "<class 'NoneType'>",
                "<class 'object'>"
            ],
            answer: 0
        },
        {
            question: "Which keyword is used to handle exceptions in Python?",
            options: ["catch", "except", "try", "throw"],
            answer: 1
        },
        {
            question: "How do you add an element to a set in Python?",
            options: ["append()", "add()", "insert()", "push()"],
            answer: 1
        },
        {
            question: "Which of the following data types is mutable in Python?",
            options: ["tuple", "string", "list", "frozenset"],
            answer: 2
        },
        {
            question: "What is the primary purpose of the __init__ method in a Python class?",
            options: [
                "To delete an instance of the class",
                "To initialize the object's attributes upon creation",
                "To define the string representation of the class",
                "To import external packages into the class"
            ],
            answer: 1
        }
    ],
    datascience: [
        {
            question: "Which statistical measure represents the middle value in a sorted dataset?",
            options: ["Mean", "Median", "Mode", "Variance"],
            answer: 1
        },
        {
            question: "What is the primary objective of supervised machine learning?",
            options: [
                "To find hidden patterns in unlabeled data",
                "To predict outcomes for new data using labeled training data",
                "To group similar items together in clusters",
                "To reduce the dimensionality of large datasets"
            ],
            answer: 1
        },
        {
            question: "Which Python library is primarily used for data manipulation and analysis?",
            options: ["matplotlib", "numpy", "pandas", "scikit-learn"],
            answer: 2
        },
        {
            question: "What does a Pearson correlation coefficient of -1 indicate?",
            options: [
                "No linear correlation at all",
                "A perfect positive linear relationship",
                "A perfect negative linear relationship",
                "A weak negative linear relationship"
            ],
            answer: 2
        },
        {
            question: "What is overfitting in machine learning?",
            options: [
                "When a model performs poorly on training data and well on test data",
                "When a model performs well on training data but poorly on unseen test data",
                "When a model cannot learn the underlying pattern of the training data",
                "When the training dataset is too small for the algorithm"
            ],
            answer: 1
        }
    ],
    ai: [
        {
            question: "Which neural network architecture is best suited for sequential data like text or time-series?",
            options: [
                "CNN (Convolutional Neural Network)",
                "RNN (Recurrent Neural Network)",
                "GAN (Generative Adversarial Network)",
                "Autoencoder"
            ],
            answer: 1
        },
        {
            question: "In a neural network, what is the primary purpose of an activation function?",
            options: [
                "To initialize the weights of the neurons",
                "To calculate the prediction error",
                "To introduce non-linearity into the network",
                "To speed up the backpropagation algorithm"
            ],
            answer: 2
        },
        {
            question: "What does 'LLM' stand for in modern Artificial Intelligence?",
            options: [
                "Logical Learning Machine",
                "Linear Language Mechanism",
                "Large Language Model",
                "Latent Likelihood Model"
            ],
            answer: 2
        },
        {
            question: "Which algorithm is used to train neural networks by calculating gradients recursively?",
            options: [
                "Dijkstra's Algorithm",
                "Backpropagation",
                "K-Means Clustering",
                "A* Search"
            ],
            answer: 1
        },
        {
            question: "What is the key innovation of the Transformer architecture?",
            options: [
                "Convolutional layers for image filtering",
                "Self-attention mechanism to process context in parallel",
                "Recursive loops for memory persistence",
                "Stochastic gradient descent optimization"
            ],
            answer: 1
        }
    ],
    marketing: [
        {
            question: "What does 'SEO' stand for in digital marketing?",
            options: [
                "Search Engine Optimization",
                "Social Engagement Optimization",
                "Sales Enhancement Operation",
                "Systematic Email Outreach"
            ],
            answer: 0
        },
        {
            question: "What is 'Conversion Rate' in marketing analytics?",
            options: [
                "The percentage of visitors who complete a desired action",
                "The speed at which a website loads on mobile devices",
                "The rate of currency exchange in international sales",
                "The proportion of bounce traffic to active traffic"
            ],
            answer: 0
        },
        {
            question: "What is A/B testing in digital marketing?",
            options: [
                "Testing the app in two different programming languages",
                "Comparing two versions of a campaign to see which performs better",
                "A workflow to verify database indexing speeds",
                "Targeting customers based on alphabetical order"
            ],
            answer: 1
        },
        {
            question: "What is the primary focus of Content Marketing?",
            options: [
                "Purchasing expensive banner ads on high-traffic sites",
                "Creating and distributing valuable content to attract a defined audience",
                "Spamming email lists with product catalogs",
                "Optimizing database servers for media storage"
            ],
            answer: 1
        },
        {
            question: "What does 'CTR' stand for in marketing metrics?",
            options: [
                "Customer Transaction Rate",
                "Cost To Run",
                "Click-Through Rate",
                "Campaign Target Range"
            ],
            answer: 2
        }
    ],
    devops: [
        {
            question: "What is the primary goal of a CI/CD pipeline?",
            options: [
                "To write code comments automatically",
                "To automate integration, testing, and deployment of code changes",
                "To monitor server room temperatures",
                "To create marketing documentation automatically"
            ],
            answer: 1
        },
        {
            question: "Which tool is widely used to package applications into lightweight, portable containers?",
            options: ["Docker", "Kubernetes", "Jenkins", "Terraform"],
            answer: 0
        },
        {
            question: "In Git, which command fetches changes from remote and merges them into the current branch?",
            options: ["git push", "git fetch", "git pull", "git checkout"],
            answer: 2
        },
        {
            question: "What is the primary purpose of Kubernetes?",
            options: [
                "To build container images",
                "To orchestrate and manage containerized applications at scale",
                "To compile source code",
                "To perform load testing of databases"
            ],
            answer: 1
        },
        {
            question: "What is the main benefit of Infrastructure as Code (IaC)?",
            options: [
                "It writes source code for developer applications",
                "It provisions and manages infrastructure through definition files",
                "It acts as a physical fire suppression system in data centers",
                "It makes application code run faster on CPU cores"
            ],
            answer: 1
        }
    ]
};

// Export to window object for browser access
window.STUDY_QUESTIONS = STUDY_QUESTIONS;
