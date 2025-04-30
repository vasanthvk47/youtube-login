pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'vasanth4747'
        IMAGE_NAME = 'student-college-login-animation'
        DOCKER_REPO = 'docker.io'
        K8S_CLUSTER = 'minikube' // Assuming you are using Minikube
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
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-password', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                        sh 'echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USERNAME --password-stdin'
                    }

                    echo 'Pushing Docker image to Docker Hub...'
                    sh 'docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo 'Deploying to Kubernetes...'
                    sh '''
                        kubectl config use-context ${K8S_CLUSTER}
                        kubectl apply -f k8s/deployment.yaml --insecure-skip-tls-verify=true
                    '''
                }
            }
        }

        stage('Verify Docker Image') {
            steps {
                script {
                    echo 'Verifying Docker image...'
                    // Add commands for verification if needed (e.g., checking the deployed container, etc.)
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up...'
            // Any cleanup steps if needed
        }

        success {
            echo 'Pipeline succeeded!'
        }

        failure {
            echo 'Pipeline failed!'
        }
    }
}
