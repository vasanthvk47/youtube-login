pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'vasanth4747'
        DOCKERHUB_PASSWORD = 'vasanth@47'
        IMAGE_NAME = 'student-college-login-animation'
        DOCKER_REPO = 'docker.io'
        K8S_CLUSTER = 'minikube'
        KUBECONFIG = '/home/vasanth47/.kube/config'
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
                    echo '🛠 Building Docker image...'
                    sh 'docker build -t ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest .'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo '🔐 Logging in to Docker Hub...'
                    sh 'echo "${DOCKERHUB_PASSWORD}" | docker login -u "${DOCKERHUB_USERNAME}" --password-stdin'

                    echo '📤 Pushing Docker image...'
                    sh 'docker push ${DOCKERHUB_USERNAME}/${IMAGE_NAME}:latest'
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    echo '🚀 Deploying to Kubernetes...'
                    sh 'kubectl --kubeconfig=${KUBECONFIG} delete deployment student-app-deployment --ignore-not-found'
                    sh 'kubectl --kubeconfig=${KUBECONFIG} apply -f k8s/deployment.yaml'
                }
            }
        }

        stage('Stop Deployment') {
            steps {
                script {
                    echo '🛑 Stopping deployment...'
                    sh 'kubectl --kubeconfig=${KUBECONFIG} scale deployment student-app-deployment --replicas=0'
                }
            }
        }

        stage('Restart Deployment') {
            steps {
                script {
                    echo '🔁 Restarting deployment...'
                    sh 'kubectl --kubeconfig=${KUBECONFIG} scale deployment student-app-deployment --replicas=1'
                }
            }
        }

        stage('Get Service URL') {
            steps {
                script {
                    echo '🌐 Getting service URL...'
                    def serviceURL = sh(script: 'minikube service youtube-login-app-service --url', returnStdout: true).trim()
                    echo "✅ Service is running at: ${serviceURL}"
                }
            }
        }

        stage('Done') {
            steps {
                echo '✅ Image built, pushed, and deployed.'
            }
        }
    }

    post {
        always {
            echo '🧹 Pipeline finished. Cleaning up (if needed).'
        }
        success {
            echo '✅ Pipeline succeeded!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs for details.'
        }
    }
}
