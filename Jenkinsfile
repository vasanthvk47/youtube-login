pipeline {
    agent any

    environment {
        IMAGE_NAME = "vasanth4747/student-college-login-animation"
        TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/vasanthvk47/student-college-animation.git'
            }
        }

        stage('Verify Minikube Environment Before Build') {
            steps {
                script {
                    sh "kubectl version --client"
                    sh "kubectl config current-context"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t $IMAGE_NAME:$TAG ."
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-password', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    script {
                        sh '''
                            echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin
                            docker push "$IMAGE_NAME:$TAG"
                            docker images | grep "$IMAGE_NAME"  // Verify image exists
                        '''
                    }
                }
            }
        }

        stage('Verify Minikube Environment After Build') {
            steps {
                script {
                    sh "kubectl version --client"
                    sh "kubectl config current-context"
                }
            }
        }

        stage('Set Minikube Context') {
            steps {
                script {
                    sh "kubectl config use-context minikube"
                    sh "kubectl config current-context"  // Verify context after switching
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Apply deployment and service files to Kubernetes
                    sh "kubectl apply -f k8s/deployment.yaml --validate=false --insecure-skip-tls-verify=true"
                    sh "kubectl apply -f k8s/service.yaml --validate=false --insecure-skip-tls-verify=true"
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    sh "kubectl get pods"
                    sh "kubectl get deployments"
                    sh "kubectl get services"
                    // Wait for rollout to complete
                    sh "kubectl rollout status deployment/youtube-login-app-deployment || echo 'Rollout status failed'"
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment was successful!'
            // Slack notification (example)
            slackSend(channel: '#deployments', message: 'Deployment was successful!')
            echo '🔗 http://127.0.0.1:30056 (If NodePort is 30056)'
        }

        failure {
            echo '❌ Deployment failed.'
            // Slack notification (example)
            slackSend(channel: '#deployments', message: 'Deployment failed. Check logs.')
            echo '🔗 http://127.0.0.1:30056 (If NodePort is 30056)'
        }
    }
}
