pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'vasanth4747'
        DOCKERHUB_PASSWORD = 'vasanth@47'
        IMAGE_NAME = 'student-college-login-animation'
        DOCKER_REPO = 'docker.io'
        K8S_CLUSTER = 'minikube' // Assuming you are using Minikube
        KUBECONFIG = '/home/vasanth47/.kube/config' // Path to your Minikube kubeconfig
    }

    stages {
        stage('Checkout SCM') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker image...'
                    sh 'docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest .'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo 'Logging in to Docker Hub...'
                    sh 'echo ${DOCKERHUB_PASSWORD} | docker login -u ${DOCKERHUB_USERNAME} --password-stdin'

                    echo 'Pushing Docker image to Docker Hub...'
                    sh 'docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo 'Deploying to Kubernetes...'
                    
                    // Apply the deployment to Minikube (using the KUBECONFIG environment variable)
                    sh 'kubectl --kubeconfig=${KUBECONFIG} apply -f k8s/deployment.yaml --insecure-skip-tls-verify=true'
                }
            }
        }

        stage('Get Service URL') {
            steps {
                script {
                    echo 'Retrieving Minikube service URL...'
                    
                    // Get the service URL from Minikube
                    def serviceURL = sh(script: 'minikube service youtube-login-app-service --url', returnStdout: true).trim()
                    echo "The service is available at: ${serviceURL}"
                }
            }
        }

        stage('Verify Docker Image') {
            steps {
                echo 'Image pushed and deployment applied.'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
        }
        success {
            echo '✅ Pipeline succeeded!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
