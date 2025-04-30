pipeline {
    agent any

    environment {
        IMAGE_NAME = 'vasanth4747/student-college-login-animation'
        TAG = 'latest'
        USERNAME = 'vasanth4747'  // Your Docker Hub username
        PASSWORD = 'vasanth@47'  // Your Docker Hub password
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    sh 'docker build -t ${IMAGE_NAME}:${TAG} .'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "Logging in to Docker Hub..."
                    sh "echo ${PASSWORD} | docker login -u ${USERNAME} --password-stdin"
                    
                    echo "Pushing Docker image to Docker Hub..."
                    sh "docker push ${IMAGE_NAME}:${TAG}"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo "Deploying to Kubernetes..."

                    // Your kubectl commands to deploy the app
                    sh "kubectl apply -f deployment.yaml"
                    sh "kubectl apply -f service.yaml"
                    
                    // Retrieving the service URL from Minikube
                    def minikubeURL = sh(script: "minikube service youtube-login-app-service --url", returnStdout: true).trim()
                    echo "Service is running at: ${minikubeURL}"
                }
            }
        }

        stage('Verify Docker Image') {
            steps {
                script {
                    echo "Verifying the Docker image exists..."
                    def imageExists = sh(script: "docker images | grep ${IMAGE_NAME}", returnStatus: true)
                    if (imageExists != 0) {
                        error "Image not found locally!"
                    } else {
                        echo "Image exists locally."
                    }
                }
            }
        }
    }

    post {
        failure {
            echo "❌ Deployment failed."
            slackSend (message: "Jenkins Pipeline failed. Check the logs for more details.")
        }
        success {
            echo "✅ Deployment succeeded."
            slackSend (message: "Jenkins Pipeline succeeded. Deployment was successful.")
        }
    }
}
