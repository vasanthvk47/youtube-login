pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'vasanth4747'
        DOCKERHUB_PASSWORD = 'vasanth@47'
        IMAGE_NAME = 'student-college-login-animation'
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
            environment {
                KUBECONFIG = '/home/vasanth47/.kube/config'
            }
            steps {
                script {
                    echo 'Deploying to Kubernetes...'
                    sh 'kubectl apply -f /home/vasanth47/youtube-login-app/k8s/deployment.yaml --insecure-skip-tls-verify=true'
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
